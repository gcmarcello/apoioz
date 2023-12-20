import { getEnv, isProd } from "@/_shared/utils/settings";
import sgMail from "@sendgrid/mail";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

sgMail.setApiKey(getEnv("SENDGRID_API_KEY"));
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.join(__dirname, "templates");

export async function sendEmail({
  to,
  bcc,
  templateId,
  dynamicData,
}: {
  to?: string | string[];
  bcc?: string | string[];
  templateId: string;
  dynamicData: any;
}) {
  const template = await readEmailTemplate(templateId, dynamicData);
  const msg = {
    to,
    bcc,
    from: getEnv("SENDGRID_EMAIL"),
    subject: template.subject,
    html: template.body,
  };

  isProd &&
    (await sgMail
      .send(msg)
      .then(() => console.log("Email sent"))
      .catch((err) => {
        console.log(err.response.body.errors);
        throw "Failed to send email";
      }));
}

async function readEmailTemplate(templateId, dynamicData) {
  try {
    const templateString = await readTemplateFile(templateId);
    const populatedTemplate = replaceTemplatePlaceholders(templateString, dynamicData);
    return {
      subject: dynamicData.subject,
      body: populatedTemplate,
    };
  } catch (error) {
    console.error("Error getting email template:", error);
    throw new Error("Failed to get email template");
  }
}

async function readTemplateFile(templateId: string): Promise<string> {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "app",
    "api",
    "emails",
    "templates",
    `${templateId}.html`
  );
  const templateContent = await fs.readFile(templatePath, "utf8");
  return templateContent;
}

function replaceTemplatePlaceholders(templateString, dynamicData) {
  let populatedTemplate = templateString;
  Object.keys(dynamicData).forEach((key) => {
    populatedTemplate = populatedTemplate.replace(
      new RegExp(`{{${key}}}`, "g"),
      dynamicData[key]
    );
  });
  return populatedTemplate;
}
