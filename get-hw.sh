#!/bin/bash

cat data/users.txt | while read name
do
  echo "Collecting HW list for \"$name\""
  slug=`echo $name | sed -e 's/ /_/g'`
  node list-hw-for-user.js "$name" > "data/hw-$slug.txt"
done
