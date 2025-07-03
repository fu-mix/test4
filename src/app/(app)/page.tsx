'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Camera, Stethoscope, Loader2, Heart, Activity, ClipboardCheck } from 'lucide-react';
import { analyzeBabyStateAction } from '@/lib/actions';
import type { AnalyzeBabyStateOutput } from '@/ai/flows/analyze-baby-state';

export default function AgentPage() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeBabyStateOutput | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOn(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings to use this app.',
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };
  
  const handleToggleCamera = () => {
    if (isCameraOn) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const handleAnalyze = async () => {
    if (!isCameraOn || !videoRef.current || !canvasRef.current) {
      toast({
        variant: 'destructive',
        title: 'Camera is off',
        description: 'Please start the camera before analyzing.',
      });
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      toast({
        variant: 'destructive',
        title: 'API Key Not Set',
        description: 'Please set your Gemini API key on the Settings page.',
      });
      setIsAnalyzing(false);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUri = canvas.toDataURL('image/jpeg');
      
      const result = await analyzeBabyStateAction({ photoDataUri: dataUri, apiKey });
      
      if (result.error) {
          toast({ variant: 'destructive', title: 'Analysis Failed', description: result.error });
      } else if (result.data) {
          setAnalysisResult(result.data);
          toast({ title: 'Analysis Complete', description: "We've analyzed the baby's state." });
      }
    }
    setIsAnalyzing(false);
  };

  // Stop camera on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Cocoro.Agent</h1>
        <p className="text-xl text-primary">AI育児支援エージェント</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted/40">
            <video ref={videoRef} className="h-full w-full object-cover data-[hidden=true]:hidden" data-hidden={!isCameraOn} autoPlay muted playsInline />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground data-[hidden=true]:hidden" data-hidden={isCameraOn}>
              <Camera className="h-16 w-16" />
              <p className="mt-4">カメラを開始してください</p>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
        <CardFooter className="grid grid-cols-2 gap-4">
          <Button onClick={handleToggleCamera} variant={isCameraOn ? "secondary" : "default"} size="lg">
            <Camera className="mr-2 h-5 w-5" />
            {isCameraOn ? 'カメラを停止' : 'カメラを開始'}
          </Button>
          <Button onClick={handleAnalyze} disabled={!isCameraOn || isAnalyzing} variant="secondary" size="lg">
            {isAnalyzing ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Stethoscope className="mr-2 h-5 w-5" />
            )}
            赤ちゃんの状態を分析
          </Button>
        </CardFooter>
      </Card>
      
      {analysisResult && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="text-primary" />
              分析結果
            </CardTitle>
            <CardDescription>AI育児支援エージェント「こころ」からのメッセージです。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-base">
             <div className="flex items-start gap-4">
                <div className="rounded-full bg-accent/50 p-2 text-primary">
                    <Heart className="h-6 w-6" />
                </div>
                <div>
                    <h4 className="font-semibold text-primary">赤ちゃんの今の気持ち</h4>
                    <p className="text-foreground/80">{analysisResult.mood}</p>
                </div>
             </div>
             <div className="flex items-start gap-4">
                <div className="rounded-full bg-accent/50 p-2 text-primary">
                    <Activity className="h-6 w-6" />
                </div>
                <div>
                    <h4 className="font-semibold text-primary">赤ちゃんの様子</h4>
                    <p className="text-foreground/80">{analysisResult.activity} ({analysisResult.isAsleep ? 'すやすや眠っています' : '起きています'})</p>
                </div>
             </div>
             <div className="flex items-start gap-4">
                <div className="rounded-full bg-accent/50 p-2 text-primary">
                    <ClipboardCheck className="h-6 w-6" />
                </div>
                <div>
                    <h4 className="font-semibold text-primary">こころからのアドバイス</h4>
                    <ul className="mt-2 list-disc list-inside space-y-1 text-foreground/80">
                        {analysisResult.needs.map((need, index) => <li key={index}>{need}</li>)}
                    </ul>
                </div>
             </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
