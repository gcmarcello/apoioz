import { isProd } from "@/_shared/utils/settings";
import sgMail from "@sendgrid/mail";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.join(__dirname, "templates");

export async function sendEmail({ to, templateId, dynamicData }) {
  const template = await getEmailTemplate(templateId, dynamicData);
  const msg = {
    to,
    from: "contato@apoioz.com.br",
    subject: template.subject,
    html: template.body,
  };

  isProd &&
    (await sgMail.send(msg).catch((err) => {
      throw "Failed to send email";
    }));
}

async function getEmailTemplate(templateId, dynamicData) {
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
  const templatePath = path.join(templatesDir, `${templateId}.html`);
  try {
    const templateContent = await fs.readFile(templatePath, "utf8");
    return templateContent;
  } catch (error) {
    console.error("Error reading the template file:", error);
    throw new Error(`Failed to read the template file: ${templateId}`);
  }
}

function replaceTemplatePlaceholders(templateString, dynamicData) {
  let populatedTemplate = templateString;
  Object.keys(dynamicData).forEach((key) => {
    // Replace all occurrences of the placeholder keys with actual data
    populatedTemplate = populatedTemplate.replace(
      new RegExp(`{{${key}}}`, "g"),
      dynamicData[key]
    );
  });
  return populatedTemplate;
}
