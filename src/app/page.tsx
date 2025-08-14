'use client'

import React, { useState, useCallback } from 'react'
import { FileUpload } from '@/components/FileUpload'
import { ProgressIndicator } from '@/components/ProgressIndicator'
import { ResultsDisplay } from '@/components/ResultsDisplay'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Sparkles, Download, Upload, FileText, Star, CheckCircle, Zap, Brain } from 'lucide-react'

interface EvaluationStage {
  id: string
  name: string
  description: string
  status: 'pending' | 'processing' | 'completed' | 'error'
}

interface EvaluationResult {
  id: string
  name: string
  description: string
  content: string
  score?: number
  status: 'completed' | 'error'
}

const EVALUATION_STAGES: EvaluationStage[] = [
  {
    id: 'line-editing',
    name: 'Line & Copy Editing',
    description: 'Grammar, syntax, clarity, and prose fluidity',
    status: 'pending'
  },
  {
    id: 'plot-evaluation',
    name: 'Plot Evaluation',
    description: 'Story structure, pacing, narrative tension, and resolution',
    status: 'pending'
  },
  {
    id: 'character-evaluation',
    name: 'Character Evaluation',
    description: 'Character depth, motivation, consistency, and emotional impact',
    status: 'pending'
  },
  {
    id: 'book-flow',
    name: 'Book Flow Evaluation',
    description: 'Rhythm, transitions, escalation patterns, and narrative cohesion',
    status: 'pending'
  },
  {
    id: 'worldbuilding',
    name: 'Worldbuilding & Setting',
    description: 'Depth, continuity, and immersive quality of the world',
    status: 'pending'
  },
  {
    id: 'overall-assessment',
    name: 'Overall Assessment',
    description: 'Comprehensive evaluation and recommendations',
    status: 'pending'
  }
]

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stages, setStages] = useState<EvaluationStage[]>(EVALUATION_STAGES)
  const [results, setResults] = useState<EvaluationResult[]>([])
  const [currentStage, setCurrentStage] = useState<string>('')
  const [showResults, setShowResults] = useState(false)

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file)
    setShowResults(false)
    setResults([])
    setProgress(0)
    setStages(EVALUATION_STAGES.map(stage => ({ ...stage, status: 'pending' as const })))
  }, [])

  const handleFileRemove = useCallback(() => {
    setSelectedFile(null)
    setShowResults(false)
    setResults([])
    setProgress(0)
    setStages(EVALUATION_STAGES.map(stage => ({ ...stage, status: 'pending' as const })))
  }, [])

  const handleStartEvaluation = useCallback(async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setProgress(0)
    setCurrentStage('')

    // Simulate the evaluation process
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i]
      setCurrentStage(stage.name)
      
      // Update stage to processing
      setStages(prev => prev.map((s, index) => 
        index === i ? { ...s, status: 'processing' } : s
      ))

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000))

      // Update progress
      const newProgress = ((i + 1) / stages.length) * 100
      setProgress(newProgress)

      // Update stage to completed
      setStages(prev => prev.map((s, index) => 
        index === i ? { ...s, status: 'completed' } : s
      ))

      // Add mock result
      const mockResult: EvaluationResult = {
        id: stage.id,
        name: stage.name,
        description: stage.description,
        content: `This is a comprehensive evaluation of the ${stage.name.toLowerCase()} aspect of your document. The analysis reveals several strengths and areas for improvement. Overall, the document demonstrates good potential with room for enhancement in specific areas.`,
        score: Math.floor(Math.random() * 4) + 6, // Random score between 6-10
        status: 'completed'
      }

      setResults(prev => [...prev, mockResult])
    }

    setIsProcessing(false)
    setShowResults(true)
  }, [selectedFile, stages])

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/mockfile.docx';
    link.download = 'ladieval-report.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = useCallback(() => {
    setSelectedFile(null)
    setShowResults(false)
    setResults([])
    setProgress(0)
    setStages(EVALUATION_STAGES.map(stage => ({ ...stage, status: 'pending' as const })))
    setIsProcessing(false)
    setCurrentStage('')
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-[#3C366E] text-white shadow-lg sticky top-0 z-50 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">X Technology</h1>
                {/* <p className="text-sm text-white/80">Intelligent Document Analysis by Ladi Technology</p> */}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ul className="flex gap-6 text-sm font-medium text-white/90">
                <li className="cursor-pointer transition-all duration-300 hover:text-white border-b-2 border-transparent hover:border-white pb-1">
                  Home
                </li>
                <li className="cursor-pointer transition-all duration-300 hover:text-white border-b-2 border-transparent hover:border-white pb-1">
                  How it Works
                </li>
                <li className="cursor-pointer transition-all duration-300 hover:text-white border-b-2 border-transparent hover:border-white pb-1">
                  Documentation
                </li>
                <li className="cursor-pointer transition-all duration-300 hover:text-white border-b-2 border-transparent hover:border-white pb-1">
                  Support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Flex grow to push footer down */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="space-y-8">
          {/* Welcome Section */}
          {!selectedFile && !showResults && (
            <div className="text-center animate-fade-in">
              <div className="company-gradient rounded-2xl p-8 text-white company-shadow mb-8">
                <h1 className="text-4xl font-bold mb-4">
                  Welcome to X Technology
                </h1>
                <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                  Transform your manuscripts with AI-powered evaluation. Get comprehensive feedback across six key criteria 
                  and unlock your documents full potential with X Technologys advanced analysis.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="summary-card card-hover animate-slide-up" style={{animationDelay: '0.1s'}}>
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Upload Document</h3>
                  <p className="text-gray-600">Support for PDF, DOCX, and DOC files with drag & drop functionality</p>
                </div>
                
                <div className="summary-card card-hover animate-slide-up" style={{animationDelay: '0.2s'}}>
                  <div className="p-4 bg-gradient-to-br from-[#3C366E] to-[#5B4B8A] rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">AI Analysis</h3>
                  <p className="text-gray-600">Advanced evaluation using X Technology's GPT-4 integration</p>
                </div>
                
                <div className="summary-card card-hover animate-slide-up" style={{animationDelay: '0.3s'}}>
                  <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Download className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Download Report</h3>
                  <p className="text-gray-600">Get detailed PDF report with actionable insights and recommendations</p>
                </div>
              </div>
            </div>
          )}

          {/* File Upload */}
          {!showResults && (
            <FileUpload
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              selectedFile={selectedFile}
              isProcessing={isProcessing}
            />
          )}

          {/* Start Evaluation Button */}
          {selectedFile && !isProcessing && !showResults && (
            <div className="text-center">
              <Button 
                onClick={handleStartEvaluation}
                size="lg"
                className="px-8 py-4 text-lg bg-[#3C366E] hover:bg-[#4A4378] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Brain className="h-5 w-5 mr-2" />
                Start X AI Analysis
              </Button>
            </div>
          )}

          {/* Progress Indicator */}
          {isProcessing && (
            <ProgressIndicator
              progress={progress}
              stages={stages}
              currentStage={currentStage}
              isProcessing={isProcessing}
            />
          )}

          {/* Results Display */}
          {showResults && (
            <div className="space-y-6">
              <ResultsDisplay
                results={results}
                onDownload={handleDownload}
              />
              
              <div className="text-center">
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 border-[#3C366E] text-[#3C366E] hover:bg-[#3C366E] hover:text-white transition-all duration-300"
                >
                  Analyze Another Document
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer - Always at bottom */}
      <footer className="bg-[#3C366E] text-white flex-shrink-0 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-white/80">&copy; 2024  AI by X Technology. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
