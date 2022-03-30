import allMember from "assets/images/projectCreate/allMember.svg";
import owner from "assets/images/projectCreate/owner.svg";
import vote1Member from "assets/images/projectCreate/vote1Member.svg";
import token from "assets/images/projectCreate/token.svg";
const selectTypeTabData = [
  {
    id: 1,
    title: "CUSTOM",
    votingPower: [
      {
        id: 1,
        icon: token,
        title: "TOKEN WEIGHTED",
        description: "More tokens more voting power.",
      },
      {
        id: 2,
        icon: vote1Member,
        title: "1 VOTE PER 1 MEMBER",
        description: "Every member gets 1 vote.",
      },
    ],
    canVote: [
      {
        id: 1,
        icon: owner,
        title: "OWNERS",
        description: "The owners who have the governance token.",
      },
      {
        id: 2,
        icon: allMember,
        title: "ALL MEMBERS",
        description: "Every member can vote.",
      },
    ],
  },
  {
    id: 2,
    title: "COMPANY",
    votingPower: [
      {
        id: 1,
        icon: token,
        title: "TOKEN WEIGHTED",
        description: "More tokens more voting power.",
      },
    ],
    canVote: [
      {
        id: 1,
        icon: owner,
        title: "OWNERS",
        description: "The owners who have the governance token.",
      },
    ],
  },
  {
    id: 3,
    title: "COLLABORATE",
    votingPower: [
      {
        id: 1,
        icon: vote1Member,
        title: "1 VOTE PER 1 MEMBER",
        description: "Every member gets 1 vote.",
      },
    ],
    canVote: [
      {
        id: 1,
        icon: allMember,
        title: "ALL MEMBERS",
        description: "Every member can vote.",
      },
    ],
  },
  {
    id: 4,
    title: "CLUB",
    votingPower: [
      {
        id: 1,
        icon: token,
        title: "TOKEN WEIGHTED",
        description: "More tokens more voting power.",
      },
    ],
    canVote: [
      {
        id: 1,
        icon: allMember,
        title: "ALL MEMBERS",
        description: "Every member can vote.",
      },
    ],
  },
];
export default selectTypeTabData;
