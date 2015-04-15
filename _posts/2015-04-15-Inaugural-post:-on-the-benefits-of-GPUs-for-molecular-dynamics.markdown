---
layout: post
title:  "Inaugural post: on the benefits of GPUs for molecular dynamics"
date:   2015-04-15 10:04:47
categories: GPU MD HOOMD performance-per-dollar
---

In the last few years we've seen a sudden rise in the use of GPUs for scientific
applications, in particular for those problems with what you can call local
interactions. A prime example is molecular dynamics (MD), where both old and new
codes have adapted GPUs. My experience is primarily with [HOOMD-blue][hoomd],
a code written from the ground-up to run on GPUs, often used as a poster child
for CUDA performance.

I was recently given the opportunity to test HOOMD-blue on several multi-GPU
systems, including a system with 8 NVIDIA K40 GPUs at Imperial College London and
a system with 4 K80 GPUs at NVIDIA's testing centre in Italy. I chose to focus
on the weak scaling, since that is the most interesting for real applications:
I care about being able to run larger systems efficiently on more GPUs. 

This post, however, will not focus on the weak scaling. I'll save that for
a paper or some other post ( but I'll let you know that the difference between
those two systems was negligible). Instead I will focus on the really important
question:

### Do GPUs really offer more performance than CPUs?

Your immediate reaction is probably along the lines of "What, are you stupid? Of
course!". So let me be a little more specific: do the GPUs we use for scientific
computing offer better performance per dollar (or per watt) than CPUs?

Trying to answer this question, I started out by finding a GPU setup and a CPU 
setup which have the same performance. The case I selected was a coarse-grained
simulation of liquid toluene, representing each molecule by two beads. I used
the SAFT-&gamma; Mie approach for the pair potentials, a method developed by
the [Molecular Systems Engineering][MSEsite] group at Imperial College London,
which I had the pleasure of visiting for the past six months.

As I said in the introduction, my experience with GPU-accelerated codes is
HOOMD-blue, a relatively new code primarily targeting GPUs. It also has
a multi-core CPU mode, so it is tempting to compare HOOMD-blue GPU and CPU
performance. Alas, this would not be an apples-to-apples comparison, since the
HOOMD-blue team has spent a lot more time tuning GPU performance than CPU
performance.  Instead I will compare to the CPU performance of GROMACS, a widely
used MD code targeting primarily CPUs. It also has a GPU mode, but that cannot
be used in the current comparison, as it does not support the Mie pair-potential
we're using.  Since I'm not a GROMACSinista, I asked my friend [Tom Headen][theaden]
to run that simulation. Thanks Tom!

### The answer: not for this application

My comparison is based on a system size of 128 000 toluene molecules, which
equals 256 000 coarse-grained beads, or almost 900 000 atoms ( not counting
hydrogens). For this system, a single NVIDIA K80 gives very similar performance
to a dual-socket CPU server with two Intel Xeon E5-2680v2s, each having
10 cores. So I've configured two systems that represent these performance
levels: a single-socket server with the cheapest Intel Xeon you can buy and an
NVIDIA Tesla K80, and a high-performance dual-socket Intel Xeon E5-2680v2
server. They are compared in this table:
<br><br>

| System | &nbsp;&nbsp;Performance | &nbsp;&nbsp;&nbsp;&nbsp;Cost<sup>1</sup>&nbsp;&nbsp;&nbsp;&nbsp; | Power consumption<sup>2</sup>
|--------|:-----------:|:----------------:|:-----------------------------:
| 1x&nbsp;Tesla&nbsp;K80      | 0.756 ns/h | $6 800 |  400 W
| 2x&nbsp;Xeon&nbsp;E5-2680v2 | 0.773 ns/h | $6 600 |  320 W

<small>
<br>
<sup>1</sup> Estimated with Dell's R730 server system configurator and Amazon's price for the K80 <br>
<sup>2</sup> Estimated based on [http://powersupplycalculator.net](http://powersupplycalculator.net)
<br><br>
</small>

What's striking about this table is how equal the systems are -- they differ by
just ~ 3% on performance and on hardware cost. Even though I have estimated the cost
and power consumption, I'd say these estimates are at most 20% wrong.  Remember that
GPU marketing often talks about order-of-magnitude benefits. Looking at my numbers 
I have a hard time seeing how that's justified.

### Concluding remarks

I don't want to end this post leaving you with the feeling that GPUs are
useless, so I'll offer a few remarks that mellow out the perspective. First of
all, the K80 is very good value-for-money as compared to the K40 --
it's really two K40s for the price of one.

Secondly, I've only looked at Tesla GPUs for this comparison. The GTX 980
should offer single-precision performance that's not far off from half a K80, but at
an order-of-magnitude lower cost. This is where the GPU really shines, and is
what I think most people running MD should be doing: buying consumer-class GPUs
and forgetting about the Tesla hype. Take it from more experienced people than me:
[you don't need double-precision][dp], and [you don't need ECC memory][ecc]. Period.

Finally, I will say that choosing between e.g. HOOMD-blue and GROMACS should be
done on the basis of how the various MD codes fit with what you are doing. As
I've shown you can get very good performance out of both codes.
I really like HOOMD-blue because of the tight Python integration. By contrast
GROMACS is harder to script, but it offers greater capabilities in terms of
pre- and post-processing and analysis. Choose the right tool for the job.

### Acknowledgements
Thanks again to Tom Headen at Imperial College London who did the
GROMACS simulation. Thanks also to NVIDIA for letting me test their 4x K80 
servers, and to Michael Barr and Carlo Nardone at NVIDIA for excellent support.

[hoomd]: http://codeblue.umich.edu/hoomd-blue/ 
[MSEsite]: http://molecularsystemsengineering.org/
[theaden]: http://www.imperial.ac.uk/people/t.headen
[dp]: https://groups.google.com/d/msg/hoomd-users/-UEgFhtBM8Q/2vOFlK8VsSoJ
[ecc]: https://www.xsede.org/documents/384387/561669/2013_XSEDE_ECC.pdf
