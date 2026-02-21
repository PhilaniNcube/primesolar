import { getDetailedLeadById } from "@/dal/queries/leads"
import { getSolarPanelById } from "@/dal/queries/solar-panels"
import { getBatteryById } from "@/dal/queries/batteries"
import { getInverterById } from "@/dal/queries/inverters"
import { formatCurrency } from "@/lib/currency"
import { format } from "date-fns"
import { notFound } from "next/navigation"
import { cacheLife, cacheTag } from "next/cache"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Zap,
  Battery,
  Sun,
  Activity,
} from "lucide-react"

// ── helpers ────────────────────────────────────────────────────────────────────

const statusVariant: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  new: "default",
  contacted: "secondary",
  quote_sent: "outline",
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium wrap-break-word">{value}</p>
      </div>
    </div>
  )
}

// ── resolved item type ─────────────────────────────────────────────────────────

type ResolvedItem =
  | { type: "panel";    quantity: number; label: string; detail: string; unitPrice: number }
  | { type: "battery";  quantity: number; label: string; detail: string; unitPrice: number }
  | { type: "inverter"; quantity: number; label: string; detail: string; unitPrice: number }
  | { type: "unknown";  quantity: number; itemType: string; itemId: string }

// ── component ─────────────────────────────────────────────────────────────────

/**
 * Non-cached outer shell: reads the dynamic route param (runtime data)
 * and passes the plain `id` string to the cached inner component.
 * This split is required by the Cache Components pattern — runtime data
 * cannot share a scope with `use cache`.
 */
const LeadDetail = async ({
  paramsPromise,
}: {
  paramsPromise: Promise<{ id: string }>
}) => {
  const { id } = await paramsPromise
  return <CachedLeadDetail id={id} />
}

/**
 * Cached inner component.
 * `id` is a plain serializable string and becomes part of the cache key
 * automatically, so different leads get separate cache entries.
 */
async function CachedLeadDetail({ id }: { id: string }) {
  "use cache"
  cacheLife("days")
  cacheTag(`lead-${id}`, "leads")

  const lead = await getDetailedLeadById(id)
  if (!lead) notFound()

  const { configuration } = lead
  const items = configuration?.items ?? []

  // Resolve hardware details for every configuration item in parallel
  const resolvedItems: ResolvedItem[] = await Promise.all(
    items.map(async (item): Promise<ResolvedItem> => {
      if (item.itemType === "panel") {
        const panel = await getSolarPanelById(item.itemId)
        if (!panel) return { type: "unknown", quantity: item.quantity, itemType: item.itemType, itemId: item.itemId }
        return {
          type: "panel",
          quantity: item.quantity,
          label: `${panel.brand} ${panel.model}`,
          detail: `${panel.wattage} W · ${panel.efficiency}% efficiency`,
          unitPrice: panel.pricePerUnit,
        }
      }
      if (item.itemType === "battery") {
        const battery = await getBatteryById(item.itemId)
        if (!battery) return { type: "unknown", quantity: item.quantity, itemType: item.itemType, itemId: item.itemId }
        return {
          type: "battery",
          quantity: item.quantity,
          label: `${battery.brand} ${battery.model}`,
          detail: `${battery.capacityKwh} kWh · ${battery.maxContinuousPowerKw} kW`,
          unitPrice: battery.pricePerUnit,
        }
      }
      if (item.itemType === "inverter") {
        const inverter = await getInverterById(item.itemId)
        if (!inverter) return { type: "unknown", quantity: item.quantity, itemType: item.itemType, itemId: item.itemId }
        return {
          type: "inverter",
          quantity: item.quantity,
          label: `${inverter.brand} ${inverter.model}`,
          detail: `${inverter.type} · ${inverter.efficiency}% · ${inverter.maxInputVoltage} V max`,
          unitPrice: inverter.pricePerUnit,
        }
      }
      return { type: "unknown", quantity: item.quantity, itemType: item.itemType, itemId: item.itemId }
    }),
  )

  const itemTypeIcon = {
    panel: <Sun className="h-4 w-4" />,
    battery: <Battery className="h-4 w-4" />,
    inverter: <Zap className="h-4 w-4" />,
  }

  const totalCost = resolvedItems.reduce((sum, item) => {
    if (item.type === "unknown") return sum
    return sum + item.unitPrice * item.quantity
  }, 0)

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {lead.firstName} {lead.lastName}
          </h2>
         
        </div>
        <Badge
          variant={statusVariant[lead.status] ?? "outline"}
          className="text-sm px-3 py-1 uppercase"
        >
          <span className="capitalize">{lead.status.replace(/_/g, " ")}</span>
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* ── Contact info ── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              value={
                <a
                  href={`mailto:${lead.email}`}
                  className="text-primary hover:underline"
                >
                  {lead.email}
                </a>
              }
            />
            <InfoRow
              icon={<Phone className="h-4 w-4" />}
              label="Phone"
              value={lead.phone ?? "—"}
            />
            <Separator />
            <InfoRow
              icon={<Calendar className="h-4 w-4" />}
              label="Submitted"
              value={
                lead.submittedAt
                  ? format(new Date(lead.submittedAt), "dd MMM yyyy, HH:mm")
                  : "—"
              }
            />
            <InfoRow
              icon={<Activity className="h-4 w-4" />}
              label="Created"
              value={
                lead.createdAt
                  ? format(new Date(lead.createdAt), "dd MMM yyyy, HH:mm")
                  : "—"
              }
            />
          </CardContent>
        </Card>

        {/* ── Configuration overview ── */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Configuration</CardTitle>
            {configuration?.address && (
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {configuration.address}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <InfoRow
              icon={<MapPin className="h-4 w-4" />}
              label="Coordinates"
              value={
                configuration
                  ? `${configuration.latitude.toFixed(5)}, ${configuration.longitude.toFixed(5)}`
                  : "—"
              }
            />
            <InfoRow
              icon={<Zap className="h-4 w-4" />}
              label="Est. Annual Consumption"
              value={
                configuration?.estimatedAnnualConsumption != null
                  ? `${configuration.estimatedAnnualConsumption.toLocaleString()} kWh`
                  : "—"
              }
            />
          </CardContent>
        </Card>
      </div>

      {/* ── Configuration items ── */}
      <Card className="p-4">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base">System Components</CardTitle>
              <CardDescription>
                {resolvedItems.length} component type
                {resolvedItems.length !== 1 ? "s" : ""} selected
              </CardDescription>
            </div>
            {totalCost > 0 && (
              <p className="text-sm font-semibold">
                Est. total:{" "}
                <span className="text-primary">
                  {formatCurrency(totalCost)}
                </span>
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {resolvedItems.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-muted-foreground">
              No system components found.
            </p>
          ) : (
            <div className="divide-y">
              {resolvedItems.map((item, idx) => {
                if (item.type === "unknown") {
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-3 px-6 py-4 text-sm text-muted-foreground"
                    >
                      <span className="capitalize">{item.itemType}</span>
                      <span className="font-mono text-xs">{item.itemId}</span>
                      <span>× {item.quantity}</span>
                    </div>
                  )
                }
                const icon = itemTypeIcon[item.type]
                const lineTotal = item.unitPrice * item.quantity
                return (
                  <div
                    key={idx}
                    className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-6 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        {icon}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {item.type} · {item.detail}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatCurrency(lineTotal)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} × {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default LeadDetail