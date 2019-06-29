G21 ; set units to millimeters
G90 ; use absolute coordinates
M83 ; use relative distances for extrusion

G1 F1000
G1 X1 Y1
G1 X1.5 Y1 E1
G1 Y1.5 E1

G1 E-0.8000 F2100.00000
G1 Z0.800 F10800.000
G1 X2 Y2
G1 Z0.200
G1 E0.80000 F2100.00000
G1 F1000

G1 X2.5 Y1 E1
G1 Y2.5 E1