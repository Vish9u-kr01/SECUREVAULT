"use client"

import { useState, useCallback } from "react"
import { Copy, RefreshCw, CheckCircle } from "lucide-react"

interface PasswordGeneratorProps {
  onGenerate?: (password: string) => void
}

export default function PasswordGenerator({ onGenerate }: PasswordGeneratorProps) {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState(16)
  const [useUppercase, setUseUppercase] = useState(true)
  const [useLowercase, setUseLowercase] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)
  const [excludeLookAlikes, setExcludeLookAlikes] = useState(true)
  const [copied, setCopied] = useState(false)

  const generatePassword = useCallback(() => {
    let chars = ""

    if (useUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (useLowercase) chars += "abcdefghijklmnopqrstuvwxyz"
    if (useNumbers) chars += "0123456789"
    if (useSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if (excludeLookAlikes) {
      // Remove look-alike characters: 0, O, l, 1, etc.
      chars = chars.replace(/[0Ol1]/g, "")
    }

    if (!chars) {
      setPassword("")
      return
    }

    let newPassword = ""
    for (let i = 0; i < length; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    setPassword(newPassword)
    onGenerate?.(newPassword)
  }, [length, useUppercase, useLowercase, useNumbers, useSymbols, excludeLookAlikes, onGenerate])

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full bg-card rounded-xl p-6 border border-border shadow-lg vault-card">
      <h2 className="text-lg font-bold mb-6 text-card-foreground flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-linear-to-r from-primary to-secondary" />
        Password Generator
      </h2>

      {/* Password Display */}
<div
  onClick={!password ? generatePassword : undefined}
  className="bg-linear-to-r from-primary/5 to-secondary/5
             rounded-lg p-4 mb-6 flex items-center justify-between
             border border-border/50 cursor-pointer"
>
  <code className="font-mono text-sm text-card-foreground break-all select-all">
    {password || "Click generate"}
  </code>

  {password && (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation() // IMPORTANT
        copyToClipboard()
      }}
      className="ml-2 p-2 hover:bg-primary/10 rounded-lg transition-colors shrink-0"
      title="Copy password"
    >
      {copied ? (
        <CheckCircle size={20} className="text-green-500" />
      ) : (
        <Copy size={20} className="text-muted-foreground hover:text-primary" />
      )}
    </button>
  )}
</div>


      {/* Length Slider */}
      <div className=" h-10   mb-6">
        <div className="flex justify-between mb-3">
          <label className="text-sm font-medium">Password Length</label>
          <span className="text-sm font-semibold text-primary">{length} characters</span>
        </div>
        <input
          type="range"
          min="8"
          max="32"
          value={length}
          onChange={(e) => setLength(Number.parseInt(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <label className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors">
          <input
            type="checkbox"
            checked={useUppercase}
            onChange={(e) => setUseUppercase(e.target.checked)}
            className="w-4 h-4 accent-primary rounded"
          />
          <span className="text-sm font-medium">Uppercase (A-Z)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors">
          <input
            type="checkbox"
            checked={useLowercase}
            onChange={(e) => setUseLowercase(e.target.checked)}
            className="w-4 h-4 accent-primary rounded"
          />
          <span className="text-sm font-medium">Lowercase (a-z)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors">
          <input
            type="checkbox"
            checked={useNumbers}
            onChange={(e) => setUseNumbers(e.target.checked)}
            className="w-4 h-4 accent-primary rounded"
          />
          <span className="text-sm font-medium">Numbers (0-9)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors">
          <input
            type="checkbox"
            checked={useSymbols}
            onChange={(e) => setUseSymbols(e.target.checked)}
            className="w-4 h-4 accent-primary rounded"
          />
          <span className="text-sm font-medium">Symbols</span>
        </label>
      </div>

      <label className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors mb-6">
        <input
          type="checkbox"
          checked={excludeLookAlikes}
          onChange={(e) => setExcludeLookAlikes(e.target.checked)}
          className="w-4 h-4 accent-primary rounded"
        />
        <span className="text-sm font-medium">Exclude look-alikes (0, O, l, 1)</span>
      </label>

      {/* Generate Button */}
      <button onClick={generatePassword} className="gradient-button w-full flex items-center justify-center gap-2">
        <RefreshCw size={18} />
        Generate Password
      </button>
    </div>
  )
}
