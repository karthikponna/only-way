import {
  renderToHtmlParts,
  renderToPlainText,
} from "@unlayer/react-elements";

import { ColdEmail } from "@/components/templates/cold-email";
import type { CareerDraft, RenderedEmail } from "@/lib/types";

function assembleEmail(head: string, body: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Career note</title>
    ${head}
  </head>
  ${body}
</html>`;
}

export function renderColdEmail(draft: CareerDraft): RenderedEmail {
  const emailElement = <ColdEmail draft={draft} />;
  const { head, body } = renderToHtmlParts(emailElement);

  return {
    emailHtml: assembleEmail(head, body),
    emailText: renderToPlainText(emailElement),
  };
}
