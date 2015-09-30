---
layout: post
title:  "A histogram of CO2 emissions, as reported by car companies"
date:   2015-09-30 23:15:00
categories: random CO2
comments: true
---

Inspired by the recent revelations that VW has been cheating on NOx emissions
tests, I thought I would put together a simple histogram of car CO2 emissions as
reported by car manufacturers. This is done with data taken from
http://www.carpages.co.uk for all cars available in the UK today.
I picked those with emissions between 94 g/km and 114 g/km, which gave 1285
model/engine combinations. Without further ado:

<img src="http://asmunder.github.io/images/co2-emissions-histogram.png" alt="CO2 emission histogram" width=90%>

Notice those peaks? The two big ones are at 99 g/km and at 109 g/km. Now of
course the final emissions comes from a tradeoff made in the car ECU map between 
horsepower, fuel efficiency and emissions, but it still looks a bit fishy that 99
g/km is the optimal tradeoff point for so many more cars than e.g. 102 g/km is.
And we do know there's a lot of [fudging going on][transenv] with these measurements.

[transenv]: http://www.transportenvironment.org/press/some-mercedes-bmw-and-peugeot-models-consuming-around-50-more-fuel-official-results-new-study
