import {
  checkMasterLoaded,
  checkMasterVersionUpToDate,
} from "@master/loadMaster";
import { atom } from "jotai";

export const UKEAtom = atom<string[][] | null>(null);

type MasterLoadState = {
  isMasterVersionUpToDate: boolean | undefined;
  isMasterLoaded: boolean | undefined;
};

const initialMasterLoadState: MasterLoadState = {
  isMasterVersionUpToDate: undefined,
  isMasterLoaded: undefined,
};

const readMasterLoadState = async (): Promise<MasterLoadState> => {
  const [isMasterVersionUpToDate, isMasterLoaded] = await Promise.all([
    checkMasterVersionUpToDate(),
    checkMasterLoaded(),
  ]);

  return {
    isMasterVersionUpToDate,
    isMasterLoaded,
  };
};

export const masterLoadStateAtom = atom<MasterLoadState>(initialMasterLoadState);

masterLoadStateAtom.onMount = (setAtom) => {
  let isMounted = true;

  void readMasterLoadState().then((state) => {
    if (isMounted) {
      setAtom(state);
    }
  });

  return () => {
    isMounted = false;
  };
};

export const refreshMasterLoadStateAtom = atom(null, async (_get, set) => {
  const state = await readMasterLoadState();
  set(masterLoadStateAtom, state);
});
