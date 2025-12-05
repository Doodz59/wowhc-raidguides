import React from "react";
import { Link } from "react-router-dom";

export default function LinkifyText({ text, raid }) {
  const safeText = typeof text === "string" ? text : String(text ?? "");

  // Sécurisation
  const bosses = Array.isArray(raid?.bosses) ? raid.bosses : [];
  const trash = Array.isArray(raid?.trash) ? raid.trash : [];

  const links = {};

  bosses.forEach(b => { if (b?.name) links[b.name] = `/raid/${raid.id}/boss/${b.id}` });
  trash.forEach(t => { if (t?.name) links[t.name] = `/raid/${raid.id}/trash/${t.id}` });

  const names = Object.keys(links);
  if (names.length === 0) return safeText;

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  const pattern = new RegExp(names.map(escapeRegex).join("|"), "g");

  const parts = safeText.split(pattern);
  const matches = safeText.match(pattern) || [];

  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {matches[i] && (
            <Link to={links[matches[i]]} className="text-gold underline hover:text-yellow-400">
              {matches[i]}
            </Link>
          )}
        </React.Fragment>
      ))}
    </>
  );
}
