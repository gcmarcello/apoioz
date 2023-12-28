import { getEnv, isProd } from "@/_shared/utils/settings";
import sgMail from "@sendgrid/mail";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

sgMail.setApiKey(getEnv("SENDGRID_API_KEY") || "SENDGRID_API_KEY not set");
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

  const sendGridEmail = getEnv("SENDGRID_EMAIL");

  if (!sendGridEmail) throw "SENDGRID_EMAIL not set";

  true &&
    (await sgMail
      .send({
        from: sendGridEmail,
        to,
        bcc,
        subject: template.subject,
        html: template.body,
      })
      .then(() => console.log("Email sent"))
      .catch((err) => {
        console.log(err.response.body.errors);
        throw "Failed to send email";
      }));
}

async function readEmailTemplate(templateId: string, dynamicData: { subject: string }) {
  try {
    const templateString = await readTemplateFile(templateId);
    const populatedTemplate = replaceTemplatePlaceholders(templateString, dynamicData);
    return {
      subject: dynamicData.subject,
      body: populatedTemplate,
    };
  } catch (error) {
    console.error("Error getting email template:", error);
    throw "Failed to get email template";
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
  console.log(templatePath);
  const templateContent = await fs.readFile(templatePath, "utf8");
  return templateContent;
}

function replaceTemplatePlaceholders(templateString: string, dynamicData: any) {
  let populatedTemplate = templateString;
  Object.keys(dynamicData).forEach((key) => {
    populatedTemplate = populatedTemplate.replace(
      new RegExp(`{{${key}}}`, "g"),
      dynamicData[key]
    );
  });
  return populatedTemplate;
}
