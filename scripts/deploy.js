import { createReadStream, readFileSync, existsSync, unlinkSync } from "fs";
import { exec } from "child_process";
import rmdir from "rimraf";
import tar from "tar";
import ora from "ora";
import FormData from "form-data";
import fetch from "node-fetch";

if (!existsSync(".ret.credentials")) {
  console.log("Not logged in, so cannot deploy. To log in, run yarn run login.");
  process.exit(0);
}

const { host, token } = JSON.parse(readFileSync(".ret.credentials"));
console.log(`Deploying to ${host}`);
const step = ora({ indent: 2 }).start();

const getTs = (() => {
  const p = n => (n < 10 ? `0${n}` : n);
  return () => {
    const d = new Date();
    return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}${p(
      d.getSeconds()
    )}`;
  };
})();

(async () => {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  const res = await fetch(`https://${host}/api/ita/configs/spoke`, { headers });
  const buildEnv = {};

  try{
    const spokeConfig = await res.json();
    for (const [k, v] of Object.entries(spokeConfig.general)) {
      buildEnv[k.toUpperCase()] = v;
    }
    console.log(`finished config`);
  }catch (e)
  {
    console.log("Could not read spoke congfig from, because " + e.message);
    console.log(res);
  }

  const version = getTs();
  console.log(`Preparing build`);

  buildEnv.BUILD_VERSION = `1.0.0.${version}`;
  buildEnv.ITA_SERVER = "";
  buildEnv.POSTGREST_SERVER = "";

  const env = Object.assign(process.env, buildEnv);

  for (const d in ["./dist"]) {
    rmdir(d, err => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  }

  step.text = "Building Spoke.";

  await new Promise((resolve, reject) => {
    exec("yarn", {}, err => {
      if (err) reject(err);
      resolve();
    });
  });

  await new Promise((resolve, reject) => {
    exec("yarn build", { env }, err => {
      if (err) reject(err);
      resolve();
    });
  });

  step.text = "Preparing Deploy.";

  step.text = "Packaging Build.";
  await tar.c({ gzip: true, C: "dist", file: "_build.tar.gz" }, ["."]);
  step.text = `Uploading Build ${buildEnv.BUILD_VERSION}.`;

  let uploadedUrl;

  const runUpload = async attempt => {
    if (attempt > 3) {
      throw new Error("Upload failed.");
    }

    const formData = new FormData();
    formData.append("media", createReadStream("_build.tar.gz"));
    formData.append("promotion_mode", "with_token");

    try {
      const res = await fetch(`https://${host}/api/v1/media`, { method: "POST", body: formData });
      const payload = await res.json();
      const url = new URL(payload.origin);
      url.searchParams.set("token", payload.meta.access_token);
      uploadedUrl = url.toString();
    } catch (e) {
      step.text = `Upload failed. Retrying attempt #${attempt + 1}/3`;
      await runUpload(attempt + 1);
    }
  };

  await runUpload(0);
  unlinkSync("_build.tar.gz");

  step.text = "Build uploaded, deploying.";

  // Wait for S3 flush, kind of a hack.
  await new Promise(res => setTimeout(res, 5000));

  await fetch(`https://${host}/api/ita/deploy/spoke`, {
    headers,
    method: "POST",
    body: JSON.stringify({ url: uploadedUrl, version })
  });

  step.text = `Deployed to ${host}`;
  step.succeed();
  process.exit(0);
})();
