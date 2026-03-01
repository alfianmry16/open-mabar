'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  X,
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Download,
  Loader2,
  Zap,
  Trash2,
} from 'lucide-react'
import { useQueueStore } from '../store'
import type { Project, ProjectRole } from '../types'

interface ImportRow {
  game_id: string
  display_name: string
  games_requested: number
  is_fast_track: boolean
  _rowNum: number
  _error?: string
}

interface ImportExcelModalProps {
  project: Project
  projectRoles: ProjectRole[]
}

export function ImportExcelModal({ project }: ImportExcelModalProps) {
  const { setShowImportModal, importPlayers, isImporting, importError, setImportError } = useQueueStore()

  const [rows, setRows] = useState<ImportRow[]>([])
  const [parseError, setParseError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [importDone, setImportDone] = useState(false)
  const [importedCount, setImportedCount] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  const parseFile = useCallback(async (file: File) => {
    setParseError(null)
    setRows([])
    setImportDone(false)
    setFileName(file.name)

    if (!file.name.match(/\.xlsx?$/i)) {
      setParseError('Format file tidak didukung. Gunakan file .xlsx atau .xls')
      return
    }

    try {
      const XLSX = await import('xlsx')
      const buffer = await file.arrayBuffer()
      const wb = XLSX.read(buffer, { type: 'array' })
      const sheetName = wb.SheetNames[0]
      const ws = wb.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: '' })

      if (jsonData.length === 0) {
        setParseError('File Excel kosong atau tidak ada data')
        return
      }

      // Check required column
      const firstRow = jsonData[0]
      if (!('game_id' in firstRow)) {
        setParseError('Kolom "game_id" tidak ditemukan. Pastikan menggunakan template yang benar.')
        return
      }

      const parsed: ImportRow[] = []
      jsonData.forEach((row, idx) => {
        const gameId = String(row['game_id'] ?? '').trim()
        if (!gameId) return // skip empty rows

        const gamesReq = parseInt(String(row['games_requested'] ?? '1')) || 1
        const isFt = String(row['is_fast_track'] ?? '').toUpperCase() === 'TRUE'

        parsed.push({
          game_id: gameId,
          display_name: String(row['display_name'] ?? '').trim(),
          games_requested: Math.min(Math.max(gamesReq, 1), 99),
          is_fast_track: project.has_fast_track ? isFt : false,
          _rowNum: idx + 2, // Excel row number (1-indexed + header)
        })
      })

      if (parsed.length === 0) {
        setParseError('Tidak ada data valid ditemukan. Pastikan kolom "game_id" terisi.')
        return
      }

      setRows(parsed)
    } catch {
      setParseError('Gagal membaca file Excel. Pastikan file tidak rusak.')
    }
  }, [project.has_fast_track])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) parseFile(file)
  }, [parseFile])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) parseFile(file)
  }

  const handleImport = async () => {
    if (rows.length === 0) return
    setImportError(null)
    const count = await importPlayers(rows)
    setImportedCount(count)
    setImportDone(true)
  }

  const handleReset = () => {
    setRows([])
    setFileName(null)
    setParseError(null)
    setImportDone(false)
    setImportError(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowImportModal(false)}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
              <FileSpreadsheet className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-sm">Import Antrian dari Excel</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Upload file .xlsx untuk menambah banyak pemain sekaligus</p>
            </div>
          </div>
          <button
            onClick={() => setShowImportModal(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {/* Download Template */}
          <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800 rounded-xl px-4 py-3">
            <div>
              <p className="text-xs font-semibold text-indigo-800 dark:text-indigo-300">Belum punya template?</p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400">Download dan isi template Excel yang disediakan</p>
            </div>
            <a href="/api/queue-template" download>
              <Button size="sm" variant="outline" className="text-xs h-8 border-indigo-200 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-700 dark:text-indigo-300">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download Template
              </Button>
            </a>
          </div>

          {/* Success State */}
          {importDone ? (
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{importedCount} pemain berhasil diimport!</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Data sudah masuk ke antrian</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleReset} className="text-xs">
                  Import Lagi
                </Button>
                <Button size="sm" onClick={() => setShowImportModal(false)} className="text-xs">
                  Selesai
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Drop Zone */}
              {rows.length === 0 && (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragging
                    ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                    : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                >
                  <Upload className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {isDragging ? 'Lepaskan file di sini' : 'Drag & drop atau klik untuk upload'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Mendukung file .xlsx dan .xls</p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              )}

              {/* Parse Error */}
              {parseError && (
                <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-red-700 dark:text-red-400">{parseError}</p>
                  </div>
                  <button onClick={handleReset} className="text-red-400 hover:text-red-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Import Error */}
              {importError && (
                <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-xs font-semibold text-red-700 dark:text-red-400">{importError}</p>
                </div>
              )}

              {/* Preview Table */}
              {rows.length > 0 && (
                <div className="space-y-3">
                  {/* File info bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{fileName}</span>
                      <span className="text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                        {rows.length} pemain
                      </span>
                    </div>
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Ganti File
                    </button>
                  </div>

                  {/* Table */}
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto max-h-64 overflow-y-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
                          <tr>
                            <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">#</th>
                            <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">Game ID *</th>
                            <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">Nama</th>
                            {project.is_repeatable && (
                              <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">Game</th>
                            )}
                            {project.has_fast_track && (
                              <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">VIP</th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {rows.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                              <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                              <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">{row.game_id}</td>
                              <td className="px-3 py-2 text-slate-500 dark:text-slate-400">{row.display_name || <span className="text-slate-300 italic">—</span>}</td>
                              {project.is_repeatable && (
                                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.games_requested}</td>
                              )}
                              {project.has_fast_track && (
                                <td className="px-3 py-2">
                                  {row.is_fast_track
                                    ? <span className="inline-flex items-center gap-1 text-amber-600"><Zap className="h-3 w-3 fill-amber-400" /> VIP</span>
                                    : <span className="text-slate-300">—</span>
                                  }
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Pemain yang sudah ada di antrian aktif akan ditambah jumlah gamenya.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!importDone && rows.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-between gap-3">
            <Button variant="outline" size="sm" onClick={() => setShowImportModal(false)} className="text-xs">
              Batal
            </Button>
            <Button
              size="sm"
              onClick={handleImport}
              disabled={isImporting}
              className="text-xs min-w-[120px]"
            >
              {isImporting
                ? <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />Mengimport...</>
                : <><Upload className="h-3.5 w-3.5 mr-1.5" />Import {rows.length} Pemain</>
              }
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
