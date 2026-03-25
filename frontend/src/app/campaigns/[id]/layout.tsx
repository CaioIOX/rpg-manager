import CampaignLayoutShell from "./_components/CampaignLayoutShell";

export default function CampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CampaignLayoutShell>{children}</CampaignLayoutShell>;
}
