// QR Code generation utility
export function generateQRCodeUrl(data: string): string {
  // Using QR Server API for QR code generation
  const encodedData = encodeURIComponent(data)
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}`
}

export function generateRSVPQRData(rsvpId: string, guestName: string): string {
  return JSON.stringify({
    type: "wedding-rsvp",
    id: rsvpId,
    guest: guestName,
    timestamp: Date.now(),
  })
}
