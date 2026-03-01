import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function GET() {
  // Define headers and example data
  const headers = ['game_id', 'display_name', 'games_requested', 'is_fast_track']

  const exampleRows = [
    ['PlayerOne123', 'Player One', 1, false],
    ['GamerXYZ456', 'Gamer XYZ', 2, true],
    ['ProPlayer789', '', 1, false],
  ]

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new()
  const wsData = [headers, ...exampleRows]
  const ws = XLSX.utils.aoa_to_sheet(wsData)

  // Set column widths
  ws['!cols'] = [
    { wch: 20 }, // game_id
    { wch: 20 }, // display_name
    { wch: 18 }, // games_requested
    { wch: 15 }, // is_fast_track
  ]

  // Add notes/comments row to explain columns (as a visual guide row)
  const guideData = [
    ['--- PANDUAN ---', '', '', ''],
    ['game_id', 'WAJIB. ID Game / Username pemain.', '', ''],
    ['display_name', 'Opsional. Nama tampilan pemain.', '', ''],
    ['games_requested', 'Opsional. Jumlah game. Default: 1', '', ''],
    ['is_fast_track', 'Opsional. VIP/FastTrack: TRUE atau FALSE. Default: FALSE', '', ''],
    ['', '', '', ''],
    ['--- DATA ANDA (HAPUS BARIS PANDUAN INI) ---', '', '', ''],
  ]

  const wsGuide = XLSX.utils.aoa_to_sheet([
    ...guideData,
    headers,
    ...exampleRows,
  ])

  wsGuide['!cols'] = [
    { wch: 45 },
    { wch: 55 },
    { wch: 18 },
    { wch: 15 },
  ]

  XLSX.utils.book_append_sheet(wb, ws, 'Template Bersih')
  XLSX.utils.book_append_sheet(wb, wsGuide, 'Panduan')

  // Write to buffer
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

  return new NextResponse(buf, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="template-antrian.xlsx"',
    },
  })
}
