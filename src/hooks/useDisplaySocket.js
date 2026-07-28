import { useEffect, useState } from 'react'
import { socket } from '../socket/socket.js'

/**
 * @typedef {'idle'|'connecting'|'joining'|'connected'|'disconnected'|'error'} DisplayConnectionStatus
 */

/**
 * Owns the display's entire Socket.IO lifecycle: connect, join as `display`,
 * rejoin after every reconnect, and keep the latest `game:state` broadcast.
 *
 * A reconnected socket is a brand-new connection as far as the backend is
 * concerned - it does not remember the old room or role - so `game:join` is
 * re-emitted on every `connect` event, not just the first one.
 *
 * @param {{ gameCode: string, initialState?: import('../types/game.js').GameStatePayload, onRedirect?: (newGameCode: string) => void }} options
 */
export function useDisplaySocket({ gameCode, initialState, onRedirect }) {
  const [gameState, setGameState] = useState(initialState)
  const [connectionStatus, setConnectionStatus] = useState('idle')
  const [error, setError] = useState(undefined)
  const [hasSyncedOnce, setHasSyncedOnce] = useState(false)

  useEffect(() => {
    if (!gameCode) return

    let ackPending = true

    function joinGame() {
      setConnectionStatus('joining')
      setError(undefined)

      socket.emit('game:join', { gameCode, role: 'display' }, (ack) => {
        if (!ackPending) return

        if (!ack.success) {
          setConnectionStatus('error')
          setError(ack.message)
          return
        }

        setGameState(ack.data)
        setConnectionStatus('connected')
        setHasSyncedOnce(true)
      })
    }

    function handleConnect() {
      setConnectionStatus('connecting')
      joinGame()
    }

    function handleDisconnect() {
      setConnectionStatus('disconnected')
    }

    function handleConnectError(socketError) {
      setConnectionStatus('error')
      setError(socketError.message)
    }

    function handleGameState(state) {
      setGameState(state)
      setConnectionStatus('connected')
      setHasSyncedOnce(true)
    }

    // The facilitator sends this when they start a fresh game from this
    // display's room, so the TV can follow along without anyone touching it.
    function handleRedirect({ newGameCode }) {
      onRedirect?.(newGameCode)
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('connect_error', handleConnectError)
    socket.on('game:state', handleGameState)
    socket.on('display:redirect', handleRedirect)

    if (socket.connected) {
      joinGame()
    } else {
      setConnectionStatus('connecting')
      socket.connect()
    }

    return () => {
      ackPending = false
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('connect_error', handleConnectError)
      socket.off('game:state', handleGameState)
      socket.off('display:redirect', handleRedirect)
      socket.disconnect()
    }
  }, [gameCode, onRedirect])

  return { gameState, connectionStatus, error, hasSyncedOnce }
}
