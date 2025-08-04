"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EvaluationStage {
  id: string;
  name: string;
  description: string;
  status: "pending" | "processing" | "completed" | "error";
}

interface ProgressIndicatorProps {
  progress: number;
  stages: EvaluationStage[];
  currentStage?: string;
  isProcessing: boolean;
}

export function ProgressIndicator({
  progress,
  stages,
  currentStage,
  isProcessing,
}: ProgressIndicatorProps) {
  const getStageIcon = (status: EvaluationStage["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "processing":
        return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
      case "error":
        return <CheckCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStageStatus = (status: EvaluationStage["status"]) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "processing":
        return "Processing...";
      case "error":
        return "Error";
      default:
        return "Pending";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Loader2
            className={cn(
              "h-5 w-5",
              isProcessing
                ? "animate-spin text-primary"
                : "text-muted-foreground"
            )}
          />
          <span>Document Evaluation Progress</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
        {/* Current Stage Info */}
        {currentStage && isProcessing && (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-sm font-medium text-primary">
              Currently processing: {currentStage}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This may take a few minutes depending on document size and
              complexity.
            </p>
          </div>
        )}
        {/* Evaluation Stages */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">
            Evaluation Stages
          </h4>
          <div className="space-y-3">
            {stages.map((stage) => (
              <div
                key={stage.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border transition-colors",
                  stage.status === "processing" &&
                    "bg-primary/5 border-primary/20",
                  stage.status === "completed" &&
                    "bg-green-50 border-green-200",
                  stage.status === "error" && "bg-red-50 border-red-200",
                  stage.status === "pending" && "bg-secondary"
                )}
              >
                <div className="flex items-center space-x-3">
                  {getStageIcon(stage.status)}
                  <div>
                    <p className="font-medium text-sm">{stage.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {stage.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      "text-xs font-medium",
                      stage.status === "completed" && "text-green-600",
                      stage.status === "processing" && "text-primary",
                      stage.status === "error" && "text-red-600",
                      stage.status === "pending" && "text-muted-foreground"
                    )}
                  >
                    {getStageStatus(stage.status)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
