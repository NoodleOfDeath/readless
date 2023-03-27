#!/bin/bash

X=0
E=0
PAFF=

install_env() {
  PAFFS=()
  if [[ -f ~/.bash_profile ]]; then
    PAFFS+=("~/.bash_profile")
  fi
  if [[ -f ~/.bashrc ]]; then
    PAFFS+=("~./bashrc")
  fi
  if [[ -f ~/.zshrc ]]; then
    PAFFS+=("~/.zshrc")
  fi
  if [[ "${#PAFFS[@]}" -eq 0 ]]; then
    echo
    echo "chatgpt: dafuq couldnt find you damn env files. you running windows or summmm?"
    exit 1
  fi
  echo
  echo "chatgpt: found ${#PAFFS[@]} paths:"
  N=1
  for P in "${PAFFS[@]}"; do
    echo "$N - $P"
    ((N = N + 1))
  done
  echo "oops - to skip"
  while true; do
    echo
    echo "chatgpt: which one do you wanna write to?"
    read K
    if [[ $K =~ ^oop(s|th)?(ies?)?$ ]]; then
      echo
      echo "chatgpt: fuckin scrub. then why you say yes in the first place?"
      return
    elif ! [[ $K =~ ^[0-9]+$ ]] || [[ $K -gt "${#PAFFS[@]}" ]]; then
      echo
      echo "chatgpt: brrrrrruh, how hard it be to choose an integer between 1 and ${#PAFFS[@]}"?
      echo "chatgpt: wanna try that again?"
      read K
    else
      break
    fi
  done
  PAFF=$(eval echo ${PAFFS[$K - 1]})
  echo
  echo "chatgpt: writing envs to $PAFF"
  echo "export SKOOP_ROOT=$(dirs -c && dirs)" >>$PAFF
  echo "export PATH=\$PATH:\$SKOOP_ROOT/bin" >>$PAFF
  source $PAFF
  if [[ -z "$SKOOP_ROOT" ]]; then
    echo
    echo "chatgpt: ahhh shiz wtf? env setup failed :("
    ((E = E + 1))
  else
    echo
    echo "chatgpt: env setup successfur muvvafuckah"
    ((X = X + 1))
  fi
}

install_deps() {
  echo
  echo "chatgpt: installing node deps like bawwws"
  yarn install
  (cd src/web && yarn install)
  (cd src/server && yarn install)
  ((X = X + 1))
}

copy_dotenvs() {
  echo
  echo "chatgpt: copying dot env files"
  if [[ ! -f src/web/.env ]]; then
    cat src/web/.env-example >src/web/.env
  else
    echo "chatgpt: web .env already exists not overwritin dat shiz"
  fi
  if [[ ! -f src/server/.env ]]; then
    cat src/server/.env-example >src/server/.env
  else
    echo "chatgpt: server .env already exists, skippin dat jax"
  fi
  ((X = X + 1))
}

if [[ -z $(echo which yarn) ]]; then
  echo
  echo "chatgpt: bruh dont even get me started. you dont have 'npm' installed? you call yourself a developer? come back when you got nodejs plz"
  exit 1
fi

if [[ -z $(echo which docker) ]]; then
  echo
  echo "chatgpt: dudeeee what happened to your dock? cant send not dock pics without 'docker' installed! come back when you're grown a dock!"
  exit 1
fi

if [[ -z "$SKOOP_ROOT" ]]; then
  echo "chatgpt: yo gang, you need to set the skoop root. want me to just magically do that for ya? [y|n|hell yea|naaaaah fam]"
  read HELL_YEA
  if [[ "$HELL_YEA" =~ ^y(es)?$ ]]; then
    echo
    echo "chatgpt: pfff that was weak but fine. i'll set you up anyways"
    install_env
  elif [[ "$HELL_YEA" =~ ^(h+e+ll+(\s*fucking?)?|f+u+c+k+)\s*y([ea]+s*)? ]]; then
    echo
    echo "chatgpt: ayoooo now dazzzz what im talkin bout mf! lez fuggun gooooooooooooo"
    install_env
  else
    echo
    echo "chatgpt: well you know what? fuck you"
  fi
fi

echo
echo "chatgpt: install node dependencies you savage? [y(es)|n(o)]"
read YN
if [[ $YN =~ ^y(es)$ ]]; then
  install_deps
else
  echo
  echo "chatgpt: aite skipping. hope you know what you is doing... also, fuck you!"
fi

copy_dotenvs

echo
if [[ $E -gt 0 ]]; then
  echo "chatgpt: setup finished with $E errors. wah wah"
elif [[ $X -eq 0 ]]; then
  echo "chatgpt: ayo looks like you already set bruhhh"
else
  echo "chatgpt: awww haaaaillll yea you's all setup broski"
fi

if [[ ! -z "$PAFF" ]]; then
  echo
  echo "chatgpt: make sure to run 'source $PAFF'"
fi

echo
echo "chatgpt: now try runnin the 'skoop' or 'dkrlogs' command!"
echo
