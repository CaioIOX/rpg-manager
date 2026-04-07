import CampaignLayoutShell from "./_components/CampaignLayoutShell";

export default async function CampaignLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CampaignLayoutShell campaignID={id}>{children}</CampaignLayoutShell>;
}
