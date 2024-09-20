# Quine McClusky

Is an algorith to simplify a verbose sum of minterms using a minterms list and a table or process similar to Karnaugh mapping.

## Input

It receives a list of minterms, and a number of variables.

## Output

It returns a boolean expresion as the solution.

## Steps

1. Arrange minterms based on the number of ones in their binary representation. (Ascending)
2. Group them based on their number of ones. (Group 1 = m0, m1, m3 -> since they all have only one 1 in their bits) (If there are no ones the Group is 0)
3. Group by group in order, take 2 minterms that have only 1 different bit from group 0 to group 1, then from group 1 to group 2, etc (number of total groups will be reduced). (G0 = (0,1), (0,2), (0,3), ...)
4. Put a '-' where the bit is different in the pair binary representation.
5. Repeat 3 and 4 until there are no more 1 bit difference binary. (If table or groups are empty, then last before this try is the valid one). (G0 = (0,1,8,9),...)
6. Build a string for each element like '-01-' and then replace to ABCD or A'B'C'D' based on their position and binary, ignoring '-' but not their position. ('-01-' = B'C)
7. Add all strings into a simplified boolan expresion and return it.
