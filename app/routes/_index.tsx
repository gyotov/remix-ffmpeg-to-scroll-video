import {
  ActionFunctionArgs,
  MetaFunction,
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
  json,
} from "@remix-run/node";
import { v2 as cloudinary } from "cloudinary";
import { Form } from "@remix-run/react";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";

cloudinary.config({
  cloud_name: "dq5khv6r1",
  api_key: "797222588573414",
  api_secret: "N_hrnmAa9hMIBaKEigSXTc3joHk",
});

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const uploadHandler = unstable_createFileUploadHandler({
    maxPartSize: 100000000,
  });
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const videoBlob = formData.get("video");

  if (!videoBlob) return json({ message: "No video selected" });

  ffmpeg({ source: videoBlob.filepath })
    .inputOptions(["-y"])
    .outputOptions([
      "-vf scale=1920:-1",
      "-movflags faststart",
      "-vcodec libx264",
      "-crf 20",
      "-g 1",
      "-an",
      "-pix_fmt yuv420p",
    ])
    .output(`processed_${videoBlob.name}`)
    .on("error", (error) => console.log(error))
    .on("end", () => {
      console.log("Processing done...\nDeleting temp files...\n");

      fs.unlink(videoBlob.filepath, (error) => {
        if (error) return console.log(error);
        console.log("Temp files deleted");
      });
    })
    .run();

  return json({});
}

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Video upload and transform</h1>
      <Form method="post" encType="multipart/form-data">
        <input type="file" name="video" />
        <input type="submit" value="Submit" />
      </Form>
    </div>
  );
}
