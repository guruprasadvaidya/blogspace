import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";

export default function RTE({
  name = "content",
  control,
  label,
  defaultValue = "",
}) {
  return (
    <div className="w-full min-w-0">
      {label && (
        <label className="mb-2 block text-sm font-semibold text-[#211D25]">
          {label}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => (
          <Editor
            apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
            value={value || ""}
            onEditorChange={onChange}
            init={{
              height: 500,
              min_height: 350,
              resize: true,

              menubar: false,
              statusbar: true,
              branding: true,

              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "help",
                "wordcount",
              ],

              toolbar:
                "undo redo | blocks | " +
                "bold italic underline | " +
                "alignleft aligncenter alignright | " +
                "bullist numlist | " +
                "link image table | " +
                "removeformat | code fullscreen",

              toolbar_mode: "sliding",

              content_style: `
                body {
                  font-family: system-ui, -apple-system, BlinkMacSystemFont,
                    "Segoe UI", sans-serif;
                  font-size: 16px;
                  line-height: 1.8;
                  color: #211D25;
                  padding: 16px;
                  max-width: 100%;
                  overflow-wrap: break-word;
                }

                p {
                  margin: 0 0 16px;
                }

                h1, h2, h3, h4 {
                  color: #211D25;
                  line-height: 1.3;
                  font-weight: 700;
                  margin: 24px 0 12px;
                }

                h1 { font-size: 2rem; }
                h2 { font-size: 1.65rem; }
                h3 { font-size: 1.35rem; }

                a {
                  color: #7956A8;
                  text-decoration: underline;
                }

                blockquote {
                  border-left: 4px solid #7956A8;
                  margin: 20px 0;
                  padding: 8px 16px;
                  color: #77717C;
                  background: #FAF8FB;
                }

                img {
                  max-width: 100%;
                  height: auto;
                  border-radius: 8px;
                }

                pre {
                  overflow-x: auto;
                  padding: 16px;
                  border-radius: 8px;
                  background: #F5F3F6;
                }

                table {
                  width: 100%;
                  border-collapse: collapse;
                }

                td, th {
                  border: 1px solid #EAE7E2;
                  padding: 8px;
                }
              `,

              placeholder: "Start writing your story...",

              content_css: "default",
            }}
          />
        )}
      />
    </div>
  );
}