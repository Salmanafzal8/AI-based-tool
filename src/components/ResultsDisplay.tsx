"use client";

import React from "react";
import {
  Download,
  FileText,
  Star,
  CheckCircle,
  TrendingUp,
  Award,
  Target,
  Brain,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EvaluationResult {
  id: string;
  name: string;
  description: string;
  content: string;
  score?: number;
  status: "completed" | "error";
}

interface ResultsDisplayProps {
  results: EvaluationResult[];
  onDownload: () => void;
}

// Pie Chart Component
function PieChart({
  percentage,
  size = 120,
  strokeWidth = 8,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-block">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={
            percentage >= 80
              ? "#10b981"
              : percentage >= 60
              ? "#f59e0b"
              : "#ef4444"
          }
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-700">{percentage}%</span>
      </div>
    </div>
  );
}

// Progress Bar Component
function ProgressBar({
  percentage,
  label,
}: {
  percentage: number;
  label: string;
}) {
  const getColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="font-bold text-gray-900">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={cn(
            "h-3 rounded-full transition-all duration-1000 ease-out",
            getColor(percentage)
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function ResultsDisplay({
  results,
  onDownload,
}: ResultsDisplayProps) {
  const completedResults = results.filter((r) => r.status === "completed");
  const errorResults = results.filter((r) => r.status === "error");

  const getScoreColor = (score?: number) => {
    if (!score) return "text-gray-500";
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreText = (score?: number) => {
    if (!score) return "N/A";
    if (score >= 8) return "Excellent";
    if (score >= 6) return "Good";
    return "Needs Improvement";
  };

  const getScoreIcon = (score?: number) => {
    if (!score) return <Star className="h-4 w-4 text-gray-400" />;
    if (score >= 8) return <Award className="h-4 w-4 text-green-600" />;
    if (score >= 6) return <TrendingUp className="h-4 w-4 text-yellow-600" />;
    return <Target className="h-4 w-4 text-red-600" />;
  };



   const handleDownload = () => {
  const link = document.createElement('a');
  link.href = '/public/mockfile.docx'; // 👈 replace with correct file path (public folder)
  link.download = '/public/mockfile.docx'; // 👈 name user will see
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



  const averageScore =
    completedResults.length > 0
      ? Math.round(
          (completedResults.reduce((acc, r) => acc + (r.score || 0), 0) /
            completedResults.length) *
            10
        ) / 10
      : 0;

  const averagePercentage = Math.round(averageScore * 10);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header with Download Button */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="text-center lg:text-left">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            LadiEval AI Results
          </h2>
          <p className="text-gray-600 text-lg">
            Your document has been analyzed across {completedResults.length}{" "}
            evaluation criteria
          </p>
        </div>
        <Button
          onClick={onDownload}
          disabled={completedResults.length === 0}
          className="px-6 py-3 bg-[#3C366E] hover:bg-[#4A4378] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Download className="h-5 w-5 mr-2" />
          <span>Download LadiEval Report</span>
        </Button>
      </div>

      {/* Enhanced Summary Stats with Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Overall Score Pie Chart */}
        <div className="summary-card card-hover lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Overall Score
              </h3>
              <p className="text-gray-600 mb-4">
                Average performance across all criteria
              </p>
              <div className="space-y-3">
                <ProgressBar
                  percentage={averagePercentage}
                  label="Overall Performance"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {averageScore}/10
                  </span>
                  <span className="text-gray-600">({averagePercentage}%)</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <PieChart percentage={averagePercentage} size={140} />
            </div>
          </div>
        </div>

        <div className="summary-card card-hover">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {completedResults.length}
              </p>
              <p className="text-gray-600 font-medium">Completed</p>
            </div>
          </div>
        </div>

        <div className="summary-card card-hover">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-[#3C366E] to-[#5B4B8A] rounded-full">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {results.length}
              </p>
              <p className="text-gray-600 font-medium">Total Criteria</p>
            </div>
          </div>
        </div>
      </div>
      {/* Success Message */}
      {completedResults.length > 0 && errorResults.length === 0 && (
        <Card className="border-green-200 bg-green-50 animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-800">
                  All evaluations completed successfully!
                </h3>
                <p className="text-green-600">
                  Your document has been thoroughly analyzed by LadiEval AI.
                  Download the complete report for detailed insights.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Grid with Enhanced Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {results.map((result, index) => {
          const percentage = (result.score || 0) * 10;
          return (
            <Card
              key={result.id}
              className="card-hover animate-fade-in group hover:shadow-xl transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-gray-900 group-hover:text-[#3C366E] transition-colors">
                    {result.name}
                  </CardTitle>
                  {result.score && (
                    <div className="flex items-center space-x-3">
                      {getScoreIcon(result.score)}
                      <div className="text-right">
                        <span
                          className={cn(
                            "text-2xl font-bold block",
                            getScoreColor(result.score)
                          )}
                        >
                          {result.score}/10
                        </span>
                        <span className="text-sm text-gray-500">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-sm">{result.description}</p>
              </CardHeader>
              <CardContent>
                {result.status === "completed" ? (
                  <div className="space-y-4">
                    {/* Mini Progress Bar */}
                    {result.score && (
                      <div className="mb-4">
                        <ProgressBar
                          percentage={percentage}
                          label={`${result.name} Score`}
                        />
                      </div>
                    )}

                    <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 group-hover:border-[#3C366E]/20 transition-colors">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                        {result.content}
                      </p>
                    </div>

                    {result.score && (
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 group-hover:border-[#3C366E]/20 transition-colors">
                        <span className="text-gray-600 font-medium">
                          Overall Rating:
                        </span>
                        <div className="flex items-center space-x-2">
                          <span
                            className={cn(
                              "font-bold text-lg",
                              getScoreColor(result.score)
                            )}
                          >
                            {getScoreText(result.score)}
                          </span>
                          {getScoreIcon(result.score)}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <span className="text-red-600 font-medium">
                        Evaluation failed
                      </span>
                      <p className="text-red-500 text-sm">
                        Please try again or contact support.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Error Summary */}
      {errorResults.length > 0 && (
        <Card className="border-red-200 bg-red-50 animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800">
                  {errorResults.length} evaluation(s) failed to complete
                </h3>
                <p className="text-red-600">
                  You can still download the completed evaluations or try
                  processing again.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
