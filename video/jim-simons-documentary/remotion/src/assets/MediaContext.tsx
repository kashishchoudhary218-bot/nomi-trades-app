import React, {createContext, useContext} from 'react';

/** Measured durations (seconds) of video files in public/, keyed by public path. */
const MediaDurations = createContext<Record<string, number>>({});

export const MediaDurationsProvider: React.FC<{value: Record<string, number>; children: React.ReactNode}> = ({value, children}) => (
	<MediaDurations.Provider value={value}>{children}</MediaDurations.Provider>
);

export const useMediaDuration = (publicPath: string): number | undefined => useContext(MediaDurations)[publicPath];
