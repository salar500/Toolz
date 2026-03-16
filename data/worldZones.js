export function getWorldZones() {
  return Intl.supportedValuesOf("timeZone").map(zone => {
    const parts = zone.split("/");

    return {
      region: parts[0],
      label: parts.slice(1).join(" ").replace(/_/g, " "),
      zone
    };
  });
}
