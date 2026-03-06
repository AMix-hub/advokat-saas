export function statusLabel(status: string) {
  switch (status) {
    case 'OPEN': return 'Öppen'
    case 'PENDING': return 'Pågående'
    case 'CLOSED': return 'Stängd'
    case 'ARCHIVED': return 'Arkiverad'
    default: return status
  }
}

export function caseTypeLabel(caseType: string | null | undefined): string {
  switch (caseType) {
    case 'DISPUTE': return 'Tvist'
    case 'PROPERTY': return 'Fastighet'
    case 'WILL': return 'Testamente'
    case 'CONTRACT': return 'Avtal'
    case 'OTHER': return 'Övrigt'
    default: return 'Övrigt'
  }
}
