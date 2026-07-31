import {
  Column,
  ColumnLayouts,
  Email,
  Paragraph,
  Row,
} from "@unlayer/react-elements";

import type { CareerDraft } from "@/lib/types";

const FONT = {
  label: "Arial",
  value: "Arial, Helvetica, sans-serif",
};

export function ColdEmail({ draft }: { draft: CareerDraft }) {
  const paragraphs = draft.emailBody
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <Email
      backgroundColor="#ffffff"
      contentWidth="620px"
      previewText={`${draft.fullName} is reaching out about ${
        draft.targetCompany || "an internship opportunity"
      }.`}
    >
      <Row
        layout={ColumnLayouts.OneColumn}
        backgroundColor="#ffffff"
        padding="36px 34px"
      >
        <Column>
          <Paragraph
            fontFamily={FONT}
            fontSize="16px"
            fontWeight={700}
            lineHeight="150%"
            color="#161616"
            containerPadding="0 0 26px"
          >
            Subject: {draft.emailSubject}
          </Paragraph>
          {paragraphs.map((paragraph, paragraphIndex) =>
            paragraph.split("\n").map((line, lineIndex, lines) => (
              <Paragraph
                key={`${line}-${paragraphIndex}-${lineIndex}`}
                fontFamily={FONT}
                fontSize="16px"
                lineHeight="150%"
                color="#161616"
                containerPadding={
                  lineIndex < lines.length - 1
                    ? "0"
                    : paragraphIndex === paragraphs.length - 1
                      ? "0"
                      : "0 0 18px"
                }
              >
                {line}
              </Paragraph>
            )),
          )}
        </Column>
      </Row>
    </Email>
  );
}
