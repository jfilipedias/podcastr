import { createContext, useContext, useState, ReactNode } from 'react'

type Episode = {
  title: string,
  members: string,
  thumbnail: string,
  duration: number,
  url: string
}

type PlayerContextData = {
  episodeList: Array<Episode>,
  currentEpisodeIndex: number,
  isPlaying: boolean,
  isLooping: boolean,
  isShuffling: boolean,
  hasNext: boolean,
  hasPrevious: boolean,
  play: (episode: Episode) => void,
  playList: (list: Array<Episode>, index: number) => void,
  playNext: () => void,
  playPrevious: () => void,
  togglePlay: () => void,
  toggleLoop: () => void,
  toggleShuffle: () => void,
  setPlayingState: (playingState: boolean) => void
  clearPlayerState: () => void,
}

type PlayerContextProviderProps = {
  children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  const hasNext = isShuffling || currentEpisodeIndex < episodeList.length - 1
  const hasPrevious = isShuffling || currentEpisodeIndex > 0

  function play(episode: Episode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function playList(list: Array<Episode>, index: number) {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  function playNext() {
    if (isShuffling)
      playRandom()
    else if (hasNext)
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
  }

  function playPrevious() {
    if (isShuffling)
      playRandom()
    else if (hasPrevious)
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
  }

  function playRandom() {
    setCurrentEpisodeIndex(Math.floor(Math.random() * episodeList.length))
  }

  function togglePlay() {
    setIsPlaying(!isPlaying)
  }

  function toggleLoop() {
    setIsLooping(!isLooping)
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling)
  }

  function setPlayingState(playingState: boolean) {
    setIsPlaying(playingState)
  }

  function clearPlayerState() {
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }

  return (
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      isPlaying,
      isLooping,
      isShuffling,
      hasNext,
      hasPrevious,
      play,
      playList,
      playNext,
      playPrevious,
      togglePlay,
      toggleLoop,
      toggleShuffle,
      setPlayingState,
      clearPlayerState
    }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}