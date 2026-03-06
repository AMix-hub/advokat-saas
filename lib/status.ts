export function statusLabel(status: string) {
  switch (status) {
    case 'OPEN': return 'Öppen'
    case 'PENDING': return 'Pågående'
    case 'CLOSED': return 'Stängd'
    case 'ARCHIVED': return 'Arkiverad'
    default: return status
  }
}
