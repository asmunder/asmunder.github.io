---
layout: post
title:  "Announcing raaSAFT, an easy-to-use framework for coarse-grained molecular dynamics simulations
date:   2015-04-15 10:04:47
categories: GPU MD HOOMD raaSAFT announcement
comments: true
---

After nine months in the making, I'm very happy to announce the public release
of raaSAFT, my first free and open source scientific code. raaSAFT, pronounced
"raw saft", is a Python framework that makes it easy to run coarse-grained
molecular dynamics simulations of a wide range of chemical compounds. You can
get the code here: http://bitbucket.org/asmunder/raasaft

### Show, don't tell

Without further ado I will demonstrate what raaSAFT will let you do. The
following code snippet is all it takes for you to run a vapor-liquid equilibrium
simulation of the mixture CO<sub>2</sub> - N<sub>2</sub> at 270 Kelvin and 95.86
bar. This takes about 23 hours to run on a consumer level GPU (the GTX 970) and
quite accurately reproduces the experimentally observed distribution of the two
components in the two phases. Note in particular that the models for CO2 and N2
have not been fitted to the mixture data in any way, I'm taking the
models fitted to pure component physical properties and predicting mixture data.

```python
from hoomd_script import *
from mie import *
from gases_mie import *
from utility import *
import math

# set up the components
N2 = N2(count=1e4)
CO2 = CO2(count=3e4)
components = [N2, CO2]

# standard HOOMD init (made simple)
theBox = setupSimBox(components,elong=3.0,packing=0.5)
polyDicts = getPolyDicts(components)
sepDict = getSepDict(components)
system = init.create_random_polymers(theBox,polymers=polyDicts,separation=sepDict)

# tabulate the Mie potential and force for all our molecules, and cross interactions
setCutoff(components)
table = pair.table(width=1000)
setPotentialCoeffs(components,table,func=Mie)
setAllCrossCoeff(components,table,func=Mie)

# set up IO
xml = dump.xml(filename='con.xml', vis=True)
dump.dcd(filename='dump.dcd', period=2e4)

# integrate first in the NVE ensemble with limiter to relax the system
relaxation = integrate.nve(group=all, limit=0.01)
run(1e3)
relaxation.disable()

# parameters for NVT/NPT integration
Temp = 270.0*kBby10
Pres = 95.86*ConvFromBar
all = group.all()
integrate.mode_standard(dt=0.001) # picoseconds

# run a short NVT first to get some clustering
nvt = integrate.nvt(group=all, T=Temp, tau=0.5)
run(4e4)
nvt.disable()

# then change to NPT to get the correct pressure, do production run
npt=integrate.npt(group=all, T=Temp, P=Pres, tau=0.5, tauP=0.5)
run(15e6)
```

With [VMD][vmd] and the [density profile plugin][dens] you can then get the
distribution of each component in the simulation box, and you can of course
visualize the system. Doing this, you get the molar fraction for CO<sub>2</sub> in
the liquid as 0.89 (0.86 is the experimental observation), and in the gas it
gives you 0.60 (0.58 from experiments). Here's a side view of the system, orange
is CO<sub>2</sub> and white is N<sub>2</sub>, you can see the liquid phase at
the right-hand side.

![side view CO2 N2](co2-n2-profile.png)

### On the shoulders of giants 

There are three important building blocks that are crucial for the performance and
versatility of raaSAFT. One is the SAFT-&gamma; Mie approach to coarse graining (CG),
developed by the good people at the [Molecular Systems Engineering][MSEsite] group at
Imperial College London. You can read more about SAFT-&gamma; Mie and why it's
a very elegant and thermodynamically consistent method in [this review
paper][MullerJackson]; suffice it to say here that constructing your model from
measured physical properties has advantages over the fitting to an atomistic model
that is often done with other CG approaches. I should mention also that in my
mother tongue, "SAFT" means "fruit juice", and raaSAFT means "pure fruit juice".

The second important building block is [HOOMD-blue][hoomd], a modern GPU-first
molecular dynamics (MD) code. HOOMD-blue offers high performance, very
accurate numerical methods and a very user-friendly experience. Written in CUDA
C++ and Python, it strikes me as being very well written and as offering the user
an interface that lies at just the right level of abstraction.

The final important building block is the Python language. Having mainly worked
with (modern) Fortran on other codes, it's an absolute joy to throw together
one-liners in Python that would be two orders of magnitude more work in Fortran
or C.

### Future outlook

raaSAFT is still a very fresh code, and I think there will be potentially large
changes to the code in the future. One thing in particular that needs sorting
out is how to package and distribute the code. Currently it's just distributed
through Bitbucket, and this is a barrier to adoptation that should be lowered.
On the other hand, distributing the source code as is done now means it's very
easy for the end user to modify the code, e.g. to add a new component, and
I really want to retain that feature.

Another feature I have planned is to offer support for using also GROMACS and/or
LAMMPS as backends. Even though I really like HOOMD-blue, I realize it's not the
world's most used MD code, so again this is an opportunity to ensure as many
people as possible can use raaSAFT.

[hoomd]: http://codeblue.umich.edu/hoomd-blue/ 
[MSEsite]: http://molecularsystemsengineering.org/
[MullerJackson]:
[vmd]: 
[dens]: 
