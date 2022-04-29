import allMember from "assets/images/projectCreate/allMember.svg";
import owner from "assets/images/projectCreate/owner.svg";
import vote1Member from "assets/images/projectCreate/vote1Member.svg";
import token from "assets/images/projectCreate/token.svg";
import greenRadient from "assets/images/projectCreate/green.jpg";
import blueRadient from "assets/images/projectCreate/blue.jpg";
import pinkRadient from "assets/images/projectCreate/pink.jpg";
import yellowRadient from "assets/images/projectCreate/yellow.jpg";

const selectTypeTabData = [
  {
    id: 1,
    title: "CUSTOM",
    text: "Custom Tab description text",
    background: greenRadient,
    votingPower: [
      {
        id: 1,
        icon: token,
        title: "TOKEN WEIGHTED",
        description: "More tokens more voting power.",
        active: false,
        value: "TknW8",
        selectable: true,
      },
      {
        id: 2,
        icon: vote1Member,
        title: "1 VOTE PER 1 MEMBER",
        description: "Every member gets 1 vote.",
        active: false,
        value: "1VPM",
        selectable: true,
      },
    ],
    canVote: [
      {
        id: 1,
        icon: owner,
        title: "OWNERS",
        description: "The owners who have the governance token.",
        active: false,
        value: "Owners",
        selectable: true,
      },
      {
        id: 2,
        icon: allMember,
        title: "ALL MEMBERS",
        description: "Every member can vote.",
        active: false,
        value: "AllMembers",
        selectable: true,
      },
    ],
  },
  {
    id: 2,
    title: "COMPANY",
    text: "Company Tab description",
    background: blueRadient,
    votingPower: [
      {
        id: 1,
        icon: token,
        title: "TOKEN WEIGHTED",
        description: "More tokens more voting power.",
        active: true,
        value: "TknW8",
        selectable: false,
      },
      {
        id: 2,
        icon: vote1Member,
        title: "1 VOTE PER 1 MEMBER",
        description: "Every member gets 1 vote.",
        active: false,
        value: "1VPM",
        selectable: false,
      },
    ],
    canVote: [
      {
        id: 1,
        icon: owner,
        title: "OWNERS",
        description: "The owners who have the governance token.",
        active: true,
        value: "Owners",
        selectable: false,
      },
      {
        id: 2,
        icon: allMember,
        title: "ALL MEMBERS",
        description: "Every member can vote.",
        active: false,
        value: "AllMembers",
        selectable: false,
      },
    ],
  },
  {
    id: 3,
    title: "COLLABORATE",
    text: "Collaborate Tab text",
    background: pinkRadient,
    votingPower: [
      {
        id: 1,
        icon: vote1Member,
        title: "1 VOTE PER 1 MEMBER",
        description: "Every member gets 1 vote.",
        active: true,
        value: "1VPM",
        selectable: false,
      },
      {
        id: 2,
        icon: token,
        title: "TOKEN WEIGHTED",
        description: "More tokens more voting power.",
        active: false,
        value: "TknW8",
        selectable: false,
      },
    ],
    canVote: [
      {
        id: 1,
        icon: allMember,
        title: "ALL MEMBERS",
        description: "Every member can vote.",
        active: true,
        value: "AllMembers",
        selectable: false,
      },
      {
        id: 2,
        icon: owner,
        title: "OWNERS",
        description: "The owners who have the governance token.",
        active: false,
        value: "Owners",
        selectable: false,
      },
    ],
  },
  {
    id: 4,
    title: "CLUB",
    text: "Club Tab text",
    background: yellowRadient,
    votingPower: [
      {
        id: 1,
        icon: token,
        title: "TOKEN WEIGHTED",
        description: "More tokens more voting power.",
        active: true,
        value: "TknW8",
        selectable: false,
      },
      {
        id: 2,
        icon: vote1Member,
        title: "1 VOTE PER 1 MEMBER",
        description: "Every member gets 1 vote.",
        active: false,
        value: "1VPM",
        selectable: false,
      },
    ],
    canVote: [
      {
        id: 1,
        icon: allMember,
        title: "ALL MEMBERS",
        description: "Every member can vote.",
        active: true,
        value: "AllMembers",
        selectable: false,
      },
      {
        id: 2,
        icon: owner,
        title: "OWNERS",
        description: "The owners who have the governance token.",
        active: false,
        value: "Owners",
        selectable: false,
      },
    ],
  },
];
export default selectTypeTabData;
