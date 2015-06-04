---
layout: post
title:  "Announcing raaSAFT, an easy-to-use framework for coarse-grained molecular dynamics simulations"
date:   2015-06-04 23:45:00
categories: GPU MD HOOMD raaSAFT announcement
comments: true
---

After nine months in the making, I'm very happy to announce the public release
of raaSAFT, my first free and open source scientific code. raaSAFT, pronounced
"raw saft", is a Python framework that makes it easy to run coarse-grained
molecular dynamics (MD) simulations of a wide range of chemical compounds. It runs on
top of the very nice HOOMD-blue MD code.

You can get raaSAFT here: http://bitbucket.org/asmunder/raasaft

### Show, don't tell

Without further ado I will demonstrate what raaSAFT will let you do. The
following code snippet is all it takes to use raaSAFT for running a vapor-liquid equilibrium
simulation of the mixture CO<sub>2</sub> - N<sub>2</sub> at 270 Kelvin and 95.86
bar. This takes about 23 hours to run on a consumer level GPU (the GTX 970) and
quite accurately reproduces the experimentally observed distribution of the two
components in the two phases. Note in particular that the models for CO<sub>2</sub> and N<sub>2</sub>
have not been fitted to the mixture data in any way, I'm taking the
models fitted to pure component physical properties and predicting mixture data.

{% highlight python %}
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
{% endhighlight %}

This may not have the same extreme brevity as some examples, but note that
everything from the "# set up IO" comment on out is just plain HOOMD-blue code that we
need to run this system.

OK, so you ran that. With [VMD][vmd] and the [density profile plugin][dens] you can now get the
distribution of each component in the simulation box, and you can of course
visualize the system. Defining the molar fractions of CO<sub>2</sub> in the gas and the
liquid as xCO2 and yCO2 respectively, we obtain the following quite nice
result:

|                     | raaSAFT&nbsp;&nbsp;&nbsp;&nbsp;    | experimental value&nbsp;&nbsp;  |
| --------            | -------- | -------- |
| xCO2 &nbsp;&nbsp;&nbsp;&nbsp;    | 0.60     | 0.58     |
| yCO2                | 0.89     | 0.86     |

<br></br>
Here's a side view of the system, orange is CO<sub>2</sub> and white is N<sub>2</sub>, you can see the liquid phase at
the right-hand side:

<img src="http://asmunder.github.io/images/co2-n2-profile.png" alt="CO2 N2 simulation profile" width=90%>

### On the shoulders of giants 

There are three important building blocks that are crucial for the performance and
versatility of raaSAFT. One is the SAFT-&gamma; Mie approach to coarse graining (CG),
developed by the good people at the [Molecular Systems Engineering][MSEsite] group at
Imperial College London. You can read more about SAFT-&gamma; Mie and why it's
a very elegant and thermodynamically consistent method in [this review
paper][MullerJackson]; suffice it to say here that constructing your model from
measured physical properties has advantages over the fitting to an atomistic model
that is often done with other CG approaches. Also, using a Mie potential offers
flexibility that you just don't get with the standard Lennard-Jones, in terms of
the balance between repulsive and attractive forces. I should mention also that in my
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

So, I hope raaSAFT will be useful for others, and I'm more than happy to hear
any comments, questions etc. either here or over on Bitbucket.

[hoomd]: http://codeblue.umich.edu/hoomd-blue/ 
[MSEsite]: http://molecularsystemsengineering.org/
[MullerJackson]: http://dx.doi.org/10.1146/annurev-chembioeng-061312-103314
[vmd]: http://www.ks.uiuc.edu/Research/vmd/ 
[dens]: http://multiscalelab.org/utilities/DensityProfileTool 
