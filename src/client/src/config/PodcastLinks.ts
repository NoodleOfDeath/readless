import { mdiApple, mdiAws, mdiSpotify } from "@mdi/js";
import iheart from "@/icons/iheart";
import { NavigateFunction } from "react-router-dom";

type NavigationItemProps = {
  label: string;
  icon?: string;
  items?: NavigationItemProps[];
  onClick?: (options: { navigate?: NavigateFunction }) => void;
};

export const PODCAST_LINKS: NavigationItemProps[] = [
  {
    label: "Apple Podcasts",
    icon: mdiApple,
    onClick: () =>
      window.open(
        "https://podcasts.apple.com/us/podcast/theskoop/id1671374300",
        "_blank"
      ),
  },
  {
    label: "Amazon Music",
    icon: mdiAws,
    onClick: () =>
      window.open(
        "https://music.amazon.com/podcasts/0a765ea8-0b43-4862-9b21-57af667298b0/theskoop",
        "_blank"
      ),
  },
  {
    label: "Spotify",
    icon: mdiSpotify,
    onClick: () =>
      window.open(
        "https://open.spotify.com/show/1FOOkjziA7J1Ly3a1z54jG?si=628702de0d85485e",
        "_blank"
      ),
  },
  {
    label: "iHeartRadio",
    icon: iheart,
    onClick: () =>
      window.open(
        "https://www.iheart.com/podcast/269-theskoop-108727878?&autoplay=true",
        "_blank"
      ),
  },
];
