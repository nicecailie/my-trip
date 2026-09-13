// export const shareRequestOnWhatsApp = (request) => {
//   const link = `${window.location.origin}/?request=${request.id}`;

//   const message = [
//     "Can anyone help with this Chagga delivery?",
//     `${request.from} → ${request.to}`,
//     `Needed by: ${new Date(request.neededBy).toLocaleDateString()}`,
//     request.description || "",
//     link,
//   ]
//     .filter(Boolean)
//     .join("\n");

//   window.open(
//     `https://wa.me/?text=${encodeURIComponent(message)}`,
//     "_blank",
//     "noopener,noreferrer"
//   );
// };

export const shareRequestOnWhatsApp = (request) => {
  if (!request) return;

  const item = request.itemType
    ? request.itemType.replaceAll("_", " ")
    : "item";
  const neededBy = request.neededBy
    ? new Date(`${request.neededBy}T12:00:00`).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "a flexible date";
  const link = `${window.location.origin}${window.location.pathname}`;

  const message = [
    "Can anyone help with this Chagga delivery?",
    `${request.from} → ${request.to}`,
    `Item: ${item}`,
    `Needed by: ${neededBy}`,
    request.description ? `Details: ${request.description}` : "",
    `View Chagga: ${link}`,
  ]
    .filter(Boolean)
    .join("\n");

  window.open(
    `https://wa.me/?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer"
  );
};
