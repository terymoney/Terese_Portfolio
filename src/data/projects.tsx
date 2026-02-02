import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Shield,
  GitMerge,
  Settings,
  DollarSign,
  Shuffle,
  Landmark,
  ExternalLink,
} from "lucide-react";

export type ProjectContract = {
  label: string;
  address: string;
  explorerUrl: string;
  network: string;
};

export type ProjectLink = {
  label: string;
  href: string;
  icon?: LucideIcon;
};

export type ProjectStoryBlock = {
  title: string;
  body: string;
};

export type ProjectTimelineStep = {
  title: string;
  body: string;
  proofUrl?: string;
};

export type ProjectEvidence = {
  /** Public path from /public */
  src: string;
  /** Short title shown under the image */
  title: string;
  /** Optional short explanation */
  caption?: string;
};

export type Project = {
  slug: string;
  aliases?: string[];

  title: string;
  tagline: string;
  description: string;

  /** short text for cards */
  cardBlurb: string;

  tags: string[];
  icon: LucideIcon;

  repoUrl: string;
  liveDemoUrl?: string;

  contracts?: ProjectContract[];
  links?: ProjectLink[];

  story: ProjectStoryBlock[];
  timeline?: ProjectTimelineStep[];
  highlights?: string[];

  techStack?: string[];

  /** Evidence screenshots / proofs stored in /public */
  evidence?: ProjectEvidence[];
};

export const projects: Project[] = [
  // 1) Robot On-Chain NFTs
  {
    slug: "robot-onchain-nfts",
    aliases: ["onchain-nfts", "robot-nfts", "fully-onchain-nft"],

    title: "Robot On-Chain NFT Collection",
    tagline: "Fully on-chain SVG NFTs — no IPFS, no servers, no gateways.",
    description:
      "A production-grade on-chain NFT system deployed on Ethereum Sepolia where both metadata and images live entirely on-chain. tokenURI constructs Base64-encoded JSON and embeds Base64 SVG data URIs directly from the blockchain.",
    cardBlurb:
      "Fully on-chain SVG NFTs on Sepolia. tokenURI builds Base64 JSON + embedded SVG (no IPFS/servers), optimized via reusable SVG templates + index mapping.",

    tags: ["Solidity", "ERC721", "On-chain SVG", "Base64 JSON", "Foundry"],
    icon: Bot,

    repoUrl: "https://github.com/terymoney/Onchain-NFTs",

    contracts: [
      {
        label: "Robot NFT (ERC721)",
        address: "0x37B38ed26cD551C0A2C1c96A2Cf106E8D080e0e0",
        explorerUrl:
          "https://sepolia.etherscan.io/address/0x37B38ed26cD551C0A2C1c96A2Cf106E8D080e0e0",
        network: "Ethereum Sepolia (11155111)",
      },
      {
        label: "SVG Store",
        address: "0x8f00e9946cFBec7516926aCd1638e5Ff96c26Cdf",
        explorerUrl:
          "https://sepolia.etherscan.io/address/0x8f00e9946cFBec7516926aCd1638e5Ff96c26Cdf",
        network: "Ethereum Sepolia (11155111)",
      },
    ],

    story: [
      {
        title: "What I built",
        body: "A fully on-chain NFT system where both the metadata and SVG artwork live entirely on Ethereum. The tokenURI returns a data:application/json;base64 URI containing image data:image/svg+xml;base64 — nothing depends on IPFS or servers.",
      },
      {
        title: "The real challenge: cost",
        body: "Fully on-chain NFTs are expensive if you store full SVGs per token. I reduced cost by separating reusable SVG templates into a dedicated on-chain store and mapping tokenId → svgIndex, then assembling/encoding metadata in-memory at tokenURI time.",
      },
      {
        title: "Why it matters",
        body: "If Ethereum exists, the NFT exists. No broken links, no gateway dependence, no off-chain metadata drift — ideal for immutable art and on-chain systems.",
      },
    ],

    timeline: [
      {
        title: "Mint token",
        body: "Token is minted and stores a small mapping tokenId → svgIndex (cheap storage).",
      },
      {
        title: "Build tokenURI on-chain",
        body: "tokenURI fetches SVG by index from RobotSvgsStore, builds JSON metadata in-memory, Base64 encodes it, and returns a data URI.",
      },
      {
        title: "Render anywhere",
        body: "Marketplaces/browsers decode metadata + SVG straight from the blockchain — no IPFS.",
      },
    ],

    highlights: [
      "100% on-chain metadata + SVG artwork",
      "Storage-optimized: reusable templates + index mapping",
      "Base64 JSON + SVG data URIs generated in Solidity",
      "Sepolia deployments with explorer proof",
    ],

    techStack: ["Solidity", "Foundry", "ERC721", "Base64", "On-chain SVG"],

    evidence: [
      {
        src: "/assets/evidence/robot-onchain-nfts/nft1.png",
        title: "On-chain NFT Preview",
        caption:
          "Robot artwork rendered directly from on-chain Base64 SVG (no IPFS).",
      },
      {
        src: "/assets/evidence/robot-onchain-nfts/nft2.jpg",
        title: "Testing / Coverage Proof",
        caption:
          "Foundry tests + coverage snapshot showing real verification work.",
      },
    ],
  },

  // 2) MultiSig Account Abstraction (4337 + zkSync native AA)
  {
    slug: "multisig-account-abstraction-4337",
    aliases: ["account-abstraction", "erc-4337", "multisig-aa", "multisig"],

    title: "MultiSig Account Abstraction (ERC-4337 + zkSync Native AA)",
    tagline:
      "A smart account that supports multisig validation + better UX primitives.",
    description:
      "A portfolio project demonstrating Account Abstraction across two ecosystems: ERC-4337-style patterns on Ethereum Sepolia and zkSync Era native AA. Built around a real MultiSig smart account (min threshold) and verified interactions with on-chain proof.",
    cardBlurb:
      "MultiSig smart account (min 2 signatures) demonstrating ERC-4337 patterns + zkSync native AA. Includes UserOp flow concepts, paymaster sponsorship, and key-loss/recovery UX primitives.",

    tags: [
      "Solidity",
      "ERC-4337",
      "MultiSig",
      "zkSync",
      "Paymaster",
      "Foundry",
    ],
    icon: Shield,

    repoUrl: "https://github.com/terymoney/Multi_Sig_Account_Abstraction",

    contracts: [
      {
        label: "EVM AA Contract (Verified)",
        address: "0x063643dc5708fDcd8C52e99F1f696f73B7125cfb",
        explorerUrl:
          "https://sepolia.etherscan.io/address/0x063643dc5708fDcd8C52e99F1f696f73B7125cfb",
        network: "Ethereum Sepolia (11155111)",
      },
      {
        label: "zkSync AA Smart Account",
        address: "0x8B24BCc2568C840fd79AB3e4a8F497e00e7A6b1B",
        explorerUrl:
          "https://sepolia.explorer.zksync.io/address/0x8B24BCc2568C840fd79AB3e4a8F497e00e7A6b1B",
        network: "zkSync Era Sepolia",
      },
      {
        label: "TestERC20 (zkSync)",
        address: "0xea20A883eB092D7f6B6a9579600FE1443018b82E",
        explorerUrl:
          "https://sepolia.explorer.zksync.io/address/0xea20A883eB092D7f6B6a9579600FE1443018b82E",
        network: "zkSync Era Sepolia",
      },
    ],

    links: [
      {
        label: "Sepolia Deployment Tx",
        href: "https://sepolia.etherscan.io/tx/0x052fc5d8a14fda0f85937b86e17ed1816ab5254685337577f92ba1f26c8a2608",
        icon: ExternalLink,
      },
      {
        label: "zkSync Mint Tx",
        href: "https://sepolia.explorer.zksync.io/tx/0xfa2b7ff18034662f8360e7b3069d330916d2e888b353cd7f13ecbbf0e72db7d9",
        icon: ExternalLink,
      },
      {
        label: "zkSync Approve Tx",
        href: "https://sepolia.explorer.zksync.io/tx/0xc3c1978400438a00c30097a1651c12235d638ce1913640a9c7b3b2d56f82e85c",
        icon: ExternalLink,
      },
      {
        label: "zkSync Transfer Tx",
        href: "https://sepolia.explorer.zksync.io/tx/0x4e0cbc7f68c6a62405dc2382aa7f6f9764b3af0dbec26ca9c9aeb6d66878e869",
        icon: ExternalLink,
      },
    ],

    story: [
      {
        title: "Why Account Abstraction matters",
        body: "EOAs are single-key accounts: lose the key and you lose the account. Smart accounts enable multisig, recovery patterns, spending rules, batching, and gas sponsorship (paymasters) — Web2-grade UX on-chain.",
      },
      {
        title: "What I built (MultiSig threshold)",
        body: "I designed a MultiSig smart account with a minimum approval threshold (e.g., 2-of-N). In my deployment demo, I used 2 separate addresses to co-sign and authorize the account’s actions — proving real multisig validation.",
      },
      {
        title: "Paymaster sponsorship",
        body: "With AA, a paymaster can sponsor gas — meaning the user/signers aren’t always the ones paying transaction fees. This is crucial for onboarding (users can interact before they own ETH).",
      },
    ],

    timeline: [
      {
        title: "Deploy smart account",
        body: "Deploy a smart account that validates operations through multisig rules (minimum threshold).",
      },
      {
        title: "AA execution model",
        body: "ERC-4337 uses UserOperations submitted to a bundler, validated/executed by EntryPoint; zkSync provides native AA capabilities with its own model.",
      },
      {
        title: "Verify real interactions",
        body: "Mint/approve/transfer using the AA account to prove the flow works end-to-end on-chain.",
      },
    ],

    highlights: [
      "MultiSig validation (min threshold) for smart accounts",
      "ERC-4337-style AA concepts (UserOps / bundler / EntryPoint)",
      "Paymaster gas sponsorship for better UX",
      "zkSync native AA deployment + interaction proof",
      "Key-loss/recovery UX primitives (EOA vs Smart Account)",
    ],

    techStack: [
      "Solidity",
      "Foundry",
      "TypeScript",
      "ERC-4337 patterns",
      "zkSync",
    ],

    evidence: [
      {
        src: "/assets/evidence/multisig-account-abstraction-4337/multisigAA1.jpg",
        title: "MultiSig / AA Test Proof",
        caption:
          "Test evidence validating multisig threshold logic and AA behaviors.",
      },
      {
        src: "/assets/evidence/multisig-account-abstraction-4337/multisigAA2.jpg",
        title: "zkSync Transfer Tx Proof",
        caption:
          "On-chain proof showing the AA account flow where another party can pay gas (paymaster UX).",
      },
    ],
  },

  // 3) Merkle Airdrop (Merkle + EIP-712, zkSync)
  {
    slug: "terese-merkle-airdrop",
    aliases: ["merkle-airdrop", "eip712-airdrop"],

    title: "Terese Merkle Airdrop (Merkle + EIP-712)",
    tagline: "Two-proof claim system: whitelist proof + wallet authorization.",
    description:
      "A production-grade Merkle + EIP-712 gated airdrop system deployed on zkSync Sepolia. Each claim requires a Merkle proof and an EIP-712 signature to prevent unauthorized claims, proof reuse, and double spending.",
    cardBlurb:
      "zkSync Merkle airdrop gated by EIP-712 signatures. Pull-based safeTransferFrom model, double-claim protection, and on-chain claim proof txs.",

    tags: ["Solidity", "Merkle Tree", "EIP-712", "zkSync", "Foundry"],
    icon: GitMerge,

    repoUrl: "https://github.com/terymoney/Merkle-Tree-Airdrop-",

    contracts: [
      {
        label: "MerkleAirdrop",
        address: "0x0BC47BB3e5392EAE5E97e9fd0Dd0cc5c040fbF3f",
        explorerUrl:
          "https://sepolia.explorer.zksync.io/address/0x0BC47BB3e5392EAE5E97e9fd0Dd0cc5c040fbF3f",
        network: "zkSync Sepolia (300)",
      },
      {
        label: "ERC20 Token",
        address: "0xea20A883eB092D7f6B6a9579600FE1443018b82E",
        explorerUrl:
          "https://sepolia.explorer.zksync.io/address/0xea20A883eB092D7f6B6a9579600FE1443018b82E",
        network: "zkSync Sepolia (300)",
      },
    ],

    links: [
      {
        label: "Claim Tx #1",
        href: "https://sepolia.explorer.zksync.io/tx/0x8ba181b3e31e259b5c0107428e0e2f09309cde1996975af95a3c172fe6a6b012",
        icon: ExternalLink,
      },
      {
        label: "Claim Tx #2",
        href: "https://sepolia.explorer.zksync.io/tx/0xbc81a6d7d6c3fcd1f95964eadad7c1a8d470c3c48a534eb52a3d655d302d73e5",
        icon: ExternalLink,
      },
      {
        label: "Claim Tx #3",
        href: "https://sepolia.explorer.zksync.io/tx/0x552cd5f72ac0c805a50697c1e7ffdc2becf4f7aea8b37d6be7fcf55ae86ddfd1",
        icon: ExternalLink,
      },
      {
        label: "Claim Tx #4",
        href: "https://sepolia.explorer.zksync.io/tx/0x2c20828e57e271853b124f69066913f809c8fb45ec9a4aad1968d1291ac11992",
        icon: ExternalLink,
      },
    ],

    story: [
      {
        title: "Two proofs per claim",
        body: "A claimant must prove (1) they are whitelisted via Merkle proof and (2) they authorized the claim via EIP-712 signature. This prevents unauthorized claims, proof reuse, and double-claim attacks.",
      },
      {
        title: "Pull-based distribution model",
        body: "Instead of pre-funding the airdrop contract, the contract pulls tokens from the owner via safeTransferFrom only after validations pass. The owner can pause distribution by reducing allowance — no stranded funds in the contract.",
      },
      {
        title: "zkSync deployment reality",
        body: "Deployed using Foundry with zkSync flags. The system is designed for gas efficiency and practical operations on L2 testnet environments.",
      },
    ],

    timeline: [
      {
        title: "Build digest + verify signature",
        body: "Create EIP-712 typed data hash and verify the signer authorized (account, amount).",
      },
      {
        title: "Verify Merkle proof",
        body: "Validate that (account, amount) is part of the Merkle root whitelist.",
      },
      {
        title: "Prevent double-claim and transfer",
        body: "Check hasClaimed then safeTransferFrom(owner → claimant), then mark as claimed.",
      },
    ],

    highlights: [
      "Merkle whitelist validation",
      "EIP-712 signature-gated authorization",
      "Double-claim prevention",
      "Pull-based safeTransferFrom model (no stranded funds)",
      "On-chain claim proof transactions on zkSync Sepolia",
    ],

    techStack: ["Solidity", "Foundry", "Merkle Tree", "EIP-712", "zkSync"],

    evidence: [
      {
        src: "/assets/evidence/terese-merkle-airdrop/merkle1.jpg",
        title: "Deployment / Terminal Proof",
        caption:
          "Deploy + operational proof showing the real on-chain workflow.",
      },
      {
        src: "/assets/evidence/terese-merkle-airdrop/merkle2.jpg",
        title: "Unit Test Proof",
        caption: "Extra validation across edge cases and safety checks.",
      },
      {
        src: "/assets/evidence/terese-merkle-airdrop/merkle3.jpg",
        title: "Coverage / Test Proof",
        caption:
          "Foundry coverage snapshot supporting security-focused testing.",
      },
    ],
  },

  // 4) DAO Governance + Engine V2
  {
    slug: "teri-dao-governance-stablecoin-engine",
    aliases: ["dao-governance", "governor-timelock", "enginev2-governance"],

    title: "Teri DAO Governance + Stablecoin Engine V2",
    tagline: "A real DAO that changed a live Engine risk parameter on Sepolia.",
    description:
      "An end-to-end DAO governance system deployed on Ethereum Sepolia that controls a stablecoin engine’s risk parameters on-chain. Executed the full lifecycle (deploy → lock veVotes → propose → vote → queue → execute) to update EngineV2 minHealthFactor from 1e18 → 2e18 with transaction proofs.",
    cardBlurb:
      "End-to-end DAO governance on Sepolia: ve-locking → propose → vote → timelock → execute. Updated EngineV2 minHealthFactor from 1e18 → 2e18 with on-chain proofs.",

    tags: [
      "Solidity",
      "Foundry",
      "veVotes",
      "Governor",
      "Timelock",
      "Stablecoin Engine",
    ],
    icon: Settings,

    repoUrl: "https://github.com/terymoney/DOA-Governance",

    contracts: [
      {
        label: "GOV Token",
        address: "0xD2Ee1C1cf5A5a48007bb50cd465D3209d6EaE065",
        explorerUrl:
          "https://sepolia.etherscan.io/address/0xD2Ee1C1cf5A5a48007bb50cd465D3209d6EaE065",
        network: "Ethereum Sepolia (11155111)",
      },
      {
        label: "VeVotes (Vote-Escrow)",
        address: "0xC3c4F545BDB2e629c21249016fb11E97209866f5",
        explorerUrl:
          "https://sepolia.etherscan.io/address/0xC3c4F545BDB2e629c21249016fb11E97209866f5",
        network: "Ethereum Sepolia (11155111)",
      },
      {
        label: "Timelock",
        address: "0xf2D135FBd346465e36802E34Fc4E12315318dF96",
        explorerUrl:
          "https://sepolia.etherscan.io/address/0xf2D135FBd346465e36802E34Fc4E12315318dF96",
        network: "Ethereum Sepolia (11155111)",
      },
      {
        label: "Governor",
        address: "0x6fda319B87d2E1a712F108D66cd5b00B6AD7741d",
        explorerUrl:
          "https://sepolia.etherscan.io/address/0x6fda319B87d2E1a712F108D66cd5b00B6AD7741d",
        network: "Ethereum Sepolia (11155111)",
      },
      {
        label: "TSCv2 (Stablecoin)",
        address: "0x15eA6cF28c03086098159c658Fb7cc2a0c2a85de",
        explorerUrl:
          "https://sepolia.etherscan.io/address/0x15eA6cF28c03086098159c658Fb7cc2a0c2a85de",
        network: "Ethereum Sepolia (11155111)",
      },
      {
        label: "EngineV2",
        address: "0x0F9000849a0C9A4A0716eC98b7E7A23Ba4195584",
        explorerUrl:
          "https://sepolia.etherscan.io/address/0x0F9000849a0C9A4A0716eC98b7E7A23Ba4195584",
        network: "Ethereum Sepolia (11155111)",
      },
    ],

    links: [
      {
        label: "Propose Tx",
        href: "https://sepolia.etherscan.io/tx/0xa49bc9a1d9de42b61c46559932987fbd475e4cc22a82bc01f42eaf3c66250236",
        icon: ExternalLink,
      },
      {
        label: "Vote Tx",
        href: "https://sepolia.etherscan.io/tx/0x6af87bfee587ea597e8962c8d753a56168db81f2bdbdbf04d871b4d0bca57973",
        icon: ExternalLink,
      },
      {
        label: "Queue Tx",
        href: "https://sepolia.etherscan.io/tx/0xe24cf34ab65a59a2a0daaaba17bde70672eb2ba4a5f65f3ebb194e5a05e3afff",
        icon: ExternalLink,
      },
      {
        label: "Execute Tx",
        href: "https://sepolia.etherscan.io/tx/0xd97beaa090408120ba77928fde006bb176fc495c8f4e89cc72169b3ae548c5eb",
        icon: ExternalLink,
      },
    ],

    story: [
      {
        title: "What I built",
        body: "A complete DAO governance stack (GOV → veVotes → Governor → Timelock) wired to a stablecoin Engine so protocol risk parameters can only change via on-chain voting and delayed execution.",
      },
      {
        title: "Why ve-voting matters",
        body: "Instead of instant ERC20 voting, voters lock GOV tokens for time to earn voting power. This creates skin-in-the-game and reduces short-term vote manipulation.",
      },
      {
        title: "The real change I executed",
        body: "I governed a real Engine parameter: minHealthFactor was updated from 1e18 → 2e18 through propose → vote → queue → execute, with public Sepolia proof.",
      },
    ],

    timeline: [
      {
        title: "Lock GOV in veVotes",
        body: "Mint GOV → approve veVotes → createLock(amount, unlockTime) to gain time-weighted voting power.",
      },
      {
        title: "Propose executable calldata",
        body: "Proposal targets EngineV2.setMinHealthFactor(2e18). It’s deterministic, auditable, and not just text.",
        proofUrl:
          "https://sepolia.etherscan.io/tx/0xa49bc9a1d9de42b61c46559932987fbd475e4cc22a82bc01f42eaf3c66250236",
      },
      {
        title: "Vote, queue and execute via timelock",
        body: "Vote FOR, queue into timelock delay, then execute after ETA.",
        proofUrl:
          "https://sepolia.etherscan.io/tx/0xd97beaa090408120ba77928fde006bb176fc495c8f4e89cc72169b3ae548c5eb",
      },
    ],

    highlights: [
      "Full governance lifecycle executed on-chain",
      "veVotes locking (commitment-based influence)",
      "Timelock safety delay before execution",
      "Real Engine parameter changed with proofs",
    ],

    techStack: [
      "Solidity",
      "Foundry",
      "OpenZeppelin Governor patterns",
      "Timelock",
      "Sepolia",
    ],

    evidence: [
      {
        src: "/assets/evidence/dao-governance/daoProposal.jpg",
        title: "Proposal Proof",
        caption:
          "Proposal created with deterministic calldata (auditable change).",
      },
      {
        src: "/assets/evidence/dao-governance/dao1.jpg",
        title: "Coverage / Test Proof",
        caption: "Foundry coverage and test results.",
      },
    ],
  },

  // 5) Teri Stablecoin Protocol
  {
    slug: "teri-stablecoin-protocol",
    aliases: ["tsc", "stablecoin", "engine"],

    title: "Teri Stablecoin Protocol (TSC)",
    tagline:
      "Overcollateralized stablecoin engine with oracle safety + invariants.",
    description:
      "A decentralized, exogenously collateralized stablecoin protocol designed to keep 1 TSC ≈ $1. Users deposit collateral and mint TSC under strict health factor enforcement, Chainlink-based pricing, and stale-price protection via OracleLib.",
    cardBlurb:
      "Overcollateralized stablecoin protocol (TSC) with Engine-enforced health factor + Chainlink oracle safety. Unit/fuzz/invariant tested and deployed on Sepolia.",

    tags: [
      "Solidity",
      "Foundry",
      "Stablecoin",
      "Health Factor",
      "Chainlink Oracles",
      "Invariant Testing",
    ],
    icon: DollarSign,

    repoUrl: "https://github.com/terymoney/Terese_Stable-Coin",

    contracts: [
      {
        label: "TeriStableCoin (TSC)",
        address: "0x644D255231d38925A9c5365eeFE58ecADA94c279",
        explorerUrl:
          "https://sepolia.etherscan.io/address/0x644D255231d38925A9c5365eeFE58ecADA94c279",
        network: "Ethereum Sepolia (11155111)",
      },
      {
        label: "TeriStableCoinEngine",
        address: "0xf6FF8b4661C2cDc688932E15A6B69b3cc43546D0",
        explorerUrl:
          "https://sepolia.etherscan.io/address/0xf6FF8b4661C2cDc688932E15A6B69b3cc43546D0",
        network: "Ethereum Sepolia (11155111)",
      },
    ],

    story: [
      {
        title: "Safety is enforced, not assumed",
        body: "Users can only mint if their position stays above the minimum health factor. If minting would make a position unsafe, the Engine reverts.",
      },
      {
        title: "Separation of power",
        body: "The ERC20 token restricts minting to the Engine. All issuance and burning must pass Engine rules — no direct minting shortcuts.",
      },
      {
        title: "Oracle safety",
        body: "OracleLib adds stale-price protection to Chainlink feeds so the system refuses to operate on outdated data — a common DeFi failure mode.",
      },
      {
        title: "Tested like a protocol",
        body: "Beyond unit tests, fuzz and invariants defend core rules like ‘never undercollateralized’ across many randomized state transitions.",
      },
    ],

    timeline: [
      {
        title: "Deposit collateral",
        body: "User deposits approved collateral, which is valued using oracle pricing.",
      },
      {
        title: "Mint TSC under constraints",
        body: "Minting is allowed only if the user remains above min health factor.",
      },
      {
        title: "Repay and redeem",
        body: "Repay (burn) TSC to reduce debt, then redeem collateral safely.",
      },
    ],

    highlights: [
      "Health factor enforcement prevents unsafe minting",
      "OracleLib stale-price protection for Chainlink feeds",
      "Unit + fuzz + invariant tests (Foundry)",
      "Sepolia deployments with explorer proof",
    ],

    techStack: ["Solidity", "Foundry", "Chainlink", "Invariants", "Sepolia"],

    evidence: [
      {
        src: "/assets/evidence/terese-stable-coin/stablecoinTest1.jpg",
        title: "Engine / Oracle Safety Tests",
        caption: "Oracle safety & health factor enforcement evidence.",
      },
      {
        src: "/assets/evidence/terese-stable-coin/stablecoinTest2.jpg",
        title: "Additional Test Proof",
        caption: "Extra validation across edge cases and safety checks.",
      },
      {
        src: "/assets/evidence/terese-stable-coin/stablecoinTest3.jpg",
        title: "Invariant / Fuzz Evidence",
        caption: "Protocol-level testing beyond unit tests.",
      },
      {
        src: "/assets/evidence/terese-stable-coin/stablecoinTest4.jpg",
        title: "Coverage Snapshot",
        caption: "Coverage proof showing core engine paths tested.",
      },
    ],
  },

  // 6) Cross-chain Rebase Token (CCIP)
  {
    slug: "cross-chain-rebase-token-ccip",
    aliases: ["ccip-rebase", "rebase-bridge", "chainlink-ccip"],

    title: "Cross-Chain Rebase Token (Chainlink CCIP)",
    tagline:
      "Rebasing ERC20 bridged safely Sepolia ↔ Arbitrum Sepolia via TokenPools.",
    description:
      "A cross-chain rebasing ERC20 protocol using Chainlink CCIP to bridge rebasing value between Ethereum Sepolia and Arbitrum Sepolia without breaking supply invariants. Uses CCIP TokenPools (burn on source, mint on destination) and RMN checks; includes CCIP message tracking and destination execution proof.",
    cardBlurb:
      "Cross-chain rebasing ERC20 bridged via Chainlink CCIP (Sepolia ↔ Arbitrum Sepolia). TokenPools enforce burn/mint safety; message lifecycle tracked with execution proof.",

    tags: [
      "Solidity",
      "Foundry",
      "Chainlink CCIP",
      "TokenPools",
      "RMN",
      "Rebasing ERC20",
    ],
    icon: Shuffle,

    repoUrl: "https://github.com/terymoney/Tery_cross-chain-rebase-token",

    contracts: [
      {
        label: "RebaseToken (Sepolia)",
        address: "0x61BEE5eB1fEc0Fcc79DF555aBA36A234C890E68f",
        explorerUrl:
          "https://sepolia.etherscan.io/address/0x61BEE5eB1fEc0Fcc79DF555aBA36A234C890E68f",
        network: "Ethereum Sepolia (11155111)",
      },
      {
        label: "RebaseTokenPool (Sepolia)",
        address: "0xD212FB33460BAD1Ac6cc4b774f49c73faB58f70E",
        explorerUrl:
          "https://sepolia.etherscan.io/address/0xD212FB33460BAD1Ac6cc4b774f49c73faB58f70E",
        network: "Ethereum Sepolia (11155111)",
      },
      {
        label: "Vault (Sepolia)",
        address: "0xa2c1edE35EEc8Cb15a775AC5F29cCCF140EA115C",
        explorerUrl:
          "https://sepolia.etherscan.io/address/0xa2c1edE35EEc8Cb15a775AC5F29cCCF140EA115C",
        network: "Ethereum Sepolia (11155111)",
      },
      {
        label: "RebaseToken (Arbitrum Sepolia)",
        address: "0x85140CA85B5137CC2aca17Ec86685509D46FE5c3",
        explorerUrl:
          "https://sepolia.arbiscan.io/address/0x85140CA85B5137CC2aca17Ec86685509D46FE5c3",
        network: "Arbitrum Sepolia",
      },
      {
        label: "RebaseTokenPool (Arbitrum Sepolia)",
        address: "0xDBA79B2d2480Fbf0F4aC7D99A10558B1E4936A74",
        explorerUrl:
          "https://sepolia.arbiscan.io/address/0xDBA79B2d2480Fbf0F4aC7D99A10558B1E4936A74",
        network: "Arbitrum Sepolia",
      },
    ],

    links: [
      {
        label: "CCIP Message Tracker",
        href: "https://ccip.chain.link/#/side-drawer/msg/0x25042d1ec1d2a7ccbd88e5734de8ad7e1447355a0da3616ea8d5b95d78453c07",
        icon: ExternalLink,
      },
      {
        label: "Destination Execution Tx",
        href: "https://sepolia.arbiscan.io/tx/0xe513660455bd082a1fd8cc6786b2ad57a2d704d3597f872173cf38d711639eef",
        icon: ExternalLink,
      },
    ],

    story: [
      {
        title: "Why this is hard",
        body: "Rebasing tokens change balances over time without transfers, so naive bridging can break accounting. This design bridges value safely and preserves supply invariants across chains.",
      },
      {
        title: "Supply safety via TokenPools",
        body: "CCIP TokenPools enforce burn on the source chain and mint on the destination chain — preventing duplicated supply or double minting.",
      },
      {
        title: "Asynchronous execution reality",
        body: "CCIP messages are not instant. They pass OCR validation + RMN checks, and on testnets destination execution can sometimes be manual. I verified the full lifecycle with CCIP message tracking + destination tx proof.",
      },
    ],

    timeline: [
      {
        title: "Deposit ETH → mint (Sepolia)",
        body: "Deposit into the Vault to mint rebasing tokens on Sepolia.",
      },
      {
        title: "Bridge via CCIP (burn on source)",
        body: "Bridge call routes through CCIP Router; source TokenPool burns to preserve supply invariants.",
      },
      {
        title: "Destination execution (mint on destination)",
        body: "Destination TokenPool mints on Arbitrum Sepolia after message validation/execution.",
        proofUrl:
          "https://sepolia.arbiscan.io/tx/0xe513660455bd082a1fd8cc6786b2ad57a2d704d3597f872173cf38d711639eef",
      },
    ],

    highlights: [
      "Cross-chain rebasing token bridged safely via CCIP",
      "TokenPools burn/mint invariant enforcement",
      "RMN + asynchronous message lifecycle handled",
      "Proof links: CCIP tracker + destination execution tx",
    ],

    techStack: [
      "Solidity",
      "Foundry",
      "Chainlink CCIP",
      "TokenPools",
      "Sepolia",
      "Arbitrum Sepolia",
    ],

    evidence: [
      {
        src: "/assets/evidence/cross-chain-rebase-token/ccipTest.jpg",
        title: "Coverage / Tests Proof",
        caption: "Test + coverage evidence for CCIP + token pool logic.",
      },
      {
        src: "/assets/evidence/cross-chain-rebase-token/ccipTxn.jpg",
        title: "Bridge / Tx Proof",
        caption: "Transaction proof showing the bridge lifecycle verified.",
      },
    ],
  },

  {
    slug: "real-world-asset-protocol",
    aliases: ["rwa", "real-world-assets"],

    title: "Real World Asset (RWA) Protocol",
    tagline: "Tokenizing real-world assets on-chain (coming soon).",
    description:
      "A future project to explore compliant RWA tokenization: on-chain representations of off-chain assets, proof of reserves, and transparent issuance/redemption flows. This page is a placeholder while development is in progress.",
    cardBlurb:
      "Real-world asset tokenization concept: model off-chain assets as on-chain tokens with clear issuance/redemption rules, transparent backing proofs (attestations / proof-of-reserves), and audit-friendly flows. Focus areas include compliant onboarding, oracle/attestation integrations, and verifiable reporting so holders can validate collateralization and supply at any time. Coming soon.",

    tags: ["RWA", "Tokenization", "Solidity", "Compliance", "Oracles"],
    icon: Landmark,

    repoUrl: "https://github.com/terymoney", // or a future repo link

    story: [
      {
        title: "What it will be",
        body: "A protocol that models real-world assets as on-chain tokens with clear mint/redeem rules and transparent backing proofs.",
      },
      {
        title: "Why it matters",
        body: "RWAs connect DeFi rails to off-chain value, enabling broader financial use cases with more stability and transparency.",
      },
    ],

    highlights: [
      "Template card (project in progress)",
      "Planned: mint/redeem flows + backing proofs",
      "Planned: attestations / oracle integration",
    ],
  },
];

export function getProjectBySlug(slug?: string | null): Project | null {
  if (!slug) return null;
  const s = slug.toLowerCase();
  return (
    projects.find((p) => p.slug.toLowerCase() === s) ??
    projects.find((p) => p.aliases?.some((a) => a.toLowerCase() === s)) ??
    null
  );
}

export function getAllProjects(): Project[] {
  return projects;
}
