import Image from "next/image";
import { BOARD_STYLES } from "./style";
import { useAccount } from "wagmi";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export const Board = () => {
  const { address } = useAccount();

  const { data: tbaAddress } = useScaffoldContractRead({
    contractName: "FoodScramble",
    functionName: "tbaList",
    args: [address],
  });

  const { data: gridData } = useScaffoldContractRead({
    contractName: "FoodScramble",
    functionName: "getGrid",
  });

  const { data: you } = useScaffoldContractRead({
    contractName: "FoodScramble",
    functionName: "player",
    args: [tbaAddress],
  });

  const { data: canBuy } = useScaffoldContractRead({
    contractName: "FoodScramble",
    functionName: "canBuy",
    args: [tbaAddress],
  });

  const { data: breadAmount } = useScaffoldContractRead({
    contractName: "BreadToken",
    functionName: "balanceOf",
    args: [tbaAddress],
  });

  const { data: meatAmount } = useScaffoldContractRead({
    contractName: "MeatToken",
    functionName: "balanceOf",
    args: [tbaAddress],
  });

  const { data: lettuceAmount } = useScaffoldContractRead({
    contractName: "LettuceToken",
    functionName: "balanceOf",
    args: [tbaAddress],
  });

  const { data: tomatoAmount } = useScaffoldContractRead({
    contractName: "CoinToken",
    functionName: "balanceOf",
    args: [tbaAddress],
  });

  const { writeAsync: roll } = useScaffoldContractWrite({
    contractName: "FoodScramble",
    functionName: "movePlayer",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: buy } = useScaffoldContractWrite({
    contractName: "FoodScramble",
    functionName: "buyIngredient",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: travelRail } = useScaffoldContractWrite({
    contractName: "FoodScramble",
    functionName: "travelRail",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: cookFood } = useScaffoldContractWrite({
    contractName: "FoodScramble",
    functionName: "mintFoodNFT",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  return (
    <div className="mt-5">
      <div>
        <div className="grid lg:grid-cols-2 gap-8 flex-grow">
          <div>
            <h2 className="text-2xl mb-0">Your Token Bound Account</h2>
            <p className="mt-0">{tbaAddress}</p>
            <button
              className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
              onClick={() => roll()}
            >
              Roll
            </button>
            <br />
            {canBuy && (
              <button
                className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
                onClick={() => buy()}
              >
                Buy
              </button>
            )}
            <br />
            <button
              className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
              onClick={() => travelRail()}
            >
              Use Rail
            </button>
            <br />
            <button
              className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
              onClick={() => cookFood()}
            >
              Cook
            </button>

            <h2 className="mt-4 text-3xl">Your bags</h2>
            <p>{(breadAmount?.toString() as any) / 10 ** 18} Bread</p>
            <p>{(meatAmount?.toString() as any) / 10 ** 18} Meat</p>
            <p>{(lettuceAmount?.toString() as any) / 10 ** 18} Lettuce</p>
            <p>{(tomatoAmount?.toString() as any) / 10 ** 18} Tomato</p>
          </div>
          <div className="relative mt-3 bg-green-300" style={{ width: "530px", height: "530px" }}>
            {gridData &&
              gridData.map((item: { id: number; typeGrid: string }, index: number) => (
                <div
                  key={index}
                  className={
                    "w-20 h-20 border border-gray-300 font-bold bg-stone-200 relative z-10" +
                      " " +
                      BOARD_STYLES[index] || "grid-1"
                  }
                >
                  {item.typeGrid}
                  {you?.toString() === item.id.toString() && (
                    <Image className="chef" src="/assets/chef.png" width={40} height={40} alt="Chef" />
                  )}
                  {item.typeGrid === "Stove" && <Image src="/assets/stove.png" width={40} height={40} alt="Stove" />}
                </div>
              ))}
            <Image className="track" src="/assets/track.png" width={45} height={200} alt="Track" />
          </div>
        </div>
      </div>
    </div>
  );
};
