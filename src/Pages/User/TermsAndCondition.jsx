import React from "react";
import theme from "../../lib/theme";
import { TERMS_AND_CONDITION } from "../../lib/constant";

function TermsAndConditions() {
  return (
    <section className="min-h-screen py-12" style={{ backgroundColor: theme.colors.background.main, color: theme.colors.text.primary }}>
      <div className="max-w-4xl mx-auto px-4">
        <div
          className="rounded-2xl shadow-md p-8"
          style={{
            backgroundColor: "#FFFFFF",
            border: `1px solid ${theme.colors.border.light}`,
            color: theme.colors.text.primary,
          }}
        >
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight" style={{ color: theme.colors.text.primary }}>
            {TERMS_AND_CONDITION?.TITLE}
          </h1>

          <p className="mt-3" style={{ color: theme.colors.text.secondary }}>
            {TERMS_AND_CONDITION?.DESCRIPTION}
          </p>

          <div className="mt-8 space-y-6">
            {TERMS_AND_CONDITION?.POLICIES.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-xl p-5"
                style={{
                  backgroundColor: theme.colors.background.main,
                  border: `1px solid ${theme.colors.border.light}`,
                }}
              >
                <div className="flex items-center justify-center h-9 w-9 rounded-lg font-semibold text-white" style={{ backgroundColor: theme.colors.accent.primary }}>
                  {index + 1}
                </div>

                <div>
                  <h3 className="text-lg font-medium" style={{ color: theme.colors.text.primary }}>
                    {item.title}
                  </h3>
                  <p className="mt-1 leading-relaxed" style={{ color: theme.colors.text.secondary }}>
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm" style={{ color: theme.colors.text.secondary }}>
            {TERMS_AND_CONDITION?.FOOTER}
          </p>
        </div>
      </div>
    </section>
  );
}

export default TermsAndConditions;