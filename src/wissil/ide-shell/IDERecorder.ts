/**
 * IDE Recorder
 * 
 * Records user interactions for tutorial playback and bug reproduction
 */

interface IDEEvent {
  timestamp: number;
  type: string;
  data: any;
}

interface TutorialBundle {
  version: string;
  events: IDEEvent[];
  metadata: {
    recordedAt: string;
    duration: number;
    mode: string;
  };
}

class IDERecorder {
  private events: IDEEvent[] = [];
  private isRecording = false;
  private startTime = 0;
  private currentMode = "";

  start(mode: string = "") {
    this.isRecording = true;
    this.events = [];
    this.startTime = Date.now();
    this.currentMode = mode;
    
    this.record('recording:start', { mode });
  }

  record(type: string, data: any) {
    if (this.isRecording) {
      this.events.push({
        timestamp: Date.now() - this.startTime,
        type,
        data
      });
    }
  }

  stop() {
    if (this.isRecording) {
      this.record('recording:stop', {});
      this.isRecording = false;
    }
  }

  export(): TutorialBundle {
    const duration = this.events.length > 0 
      ? this.events[this.events.length - 1].timestamp 
      : 0;

    return {
      version: "1.0.0",
      events: this.events,
      metadata: {
        recordedAt: new Date().toISOString(),
        duration,
        mode: this.currentMode
      }
    };
  }

  exportJSON(): string {
    return JSON.stringify(this.export(), null, 2);
  }

  download(filename: string = "wissil-tutorial.json") {
    const blob = new Blob([this.exportJSON()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  load(bundle: TutorialBundle) {
    this.events = bundle.events;
    this.currentMode = bundle.metadata.mode;
  }

  getEvents(): IDEEvent[] {
    return [...this.events];
  }
}

export const ideRecorder = new IDERecorder();

