'use client';

import Head from 'next/head'
import { useEffect, useState } from 'react'
import Header from './Header'
import Cycle from './Cycle'
import CycleSidebar from './CycleSidebar'

export default function CyclePage({ visibleCycle, previousCycle, nextCycle, inCycle, availablePitches = [], availableBets = [], availableScopes = [], betIssue = null }) {
  const [visibleBet, setVisibleBet] = useState(availableBets.find(bet => belongsToCycle(visibleCycle, bet)))
  const [visibleScopes, setVisibleScopes] = useState(visibleBet?.scopes)
  const [selectedScopes, setSelectedScopes] = useState(visibleScopes)

  useEffect(() => {
    const allBetScopes = visibleBet?.scopes
    setVisibleScopes(allBetScopes)
    setSelectedScopes(allBetScopes)
  }, [visibleBet])
  
  useEffect(() => {
    if (betIssue) {
      const found =  availableBets.find(bet => belongsToCycle(visibleCycle, bet) && bet.number === Number(betIssue))
      setVisibleBet(availableBets.find(bet => belongsToCycle(visibleCycle, bet) && bet.number === Number(betIssue)))
    } else {
      setVisibleBet(availableBets.find(bet => belongsToCycle(visibleCycle, bet)))
    }
  }, [visibleCycle])

  function onBetChange({ issue, toggled }) {
    if (toggled) {
      setVisibleBet(issue)
    }
  }

  function onScopeChange({ issue, toggled }) {
    if (toggled) {
      setSelectedScopes([...selectedScopes, issue])
    } else {
      setSelectedScopes(selectedScopes.filter(sc => sc.url !== issue.url))
    }
  }

  function shouldShowPitches() {
    if (!availableBets.length) return true
    if (availablePitches.length) return true
    return false
  }

  return (
    <>
      <Head>
        <title>Shape It! - Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-white">
        <Header />

        <div className={`mt-16 ${!shouldShowPitches() && 'grid grid-cols-1 gap-6 lg:grid-cols-4'}`}>
          { !shouldShowPitches() && (
            <div>
              <CycleSidebar
                availableBets={availableBets}
                visibleBet={visibleBet}
                onBetChange={onBetChange}
                visibleScopes={visibleScopes}
                selectedScopes={selectedScopes}
                onScopeChange={onScopeChange}
              />
            </div>
          ) }
          <div className="lg:col-span-3">
            <Cycle
              visibleCycle={visibleCycle}
              inCycle={inCycle}
              previousCycle={previousCycle}
              nextCycle={nextCycle}
              pitches={availablePitches}
              selectedScopes={selectedScopes}
              shouldShowPitches={shouldShowPitches()}
            />
          </div>
        </div>

      </div>
    </>
  )
}


function belongsToCycle(cycle, bet) {
  if (!cycle || !bet) return false
  return bet.cycle === cycle.id
}
