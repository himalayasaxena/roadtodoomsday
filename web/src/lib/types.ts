export type Title = {
  id: string;
  title: string;
  year: number;
  sequenceOrder: number;
  runtimeMinutes?: number;
  posterPublic?: string;
  backdropPublic?: string;
  type?: string;
  priority?: string;
  whyWatch?: string;
  recommendationScore?: number;
  recommendationLabel?: string;
  trailerUrl?: string;
  era?: string;
  releaseDate?: string;
};

export type TrackRuntime = {
  minutes: number;
  hours: number;
  hoursRounded: number;
  daysWatching8h: number;
  label: string;
};

export type Track = {
  id: string;
  name: string;
  description: string;
  kind?: "path" | "character" | "universe";
  orderField: string;
  titleIds: string[];
  runtime?: {
    allTitles: TrackRuntime;
    toDoomsday: TrackRuntime;
  };
};

export type TracksFile = {
  version: number;
  defaultTrack: string;
  tracks: Track[];
  countdown: {
    targetId: string;
    targetTitle: string;
    releaseAt: string;
    releaseDisplay: string;
  };
};

export type TitlesFile = {
  titles: Title[];
};

export type WatchOffer = {
  providerId: string;
  providerName: string;
  type: string;
  url: string;
};

export type Provider = {
  id: string;
  displayName: string;
  logo?: string;
};
