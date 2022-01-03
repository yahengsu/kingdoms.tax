import React from 'react';
import Image from 'next/image';
import { addrs_to_token, decimals } from '../constants/constants';

type Direction = "IN" | "OUT";
type Token = "ERC20" | "ERC721";

type CardProps = {
    direction: Direction,
    netAmount: string, // Hex String
    timestamp: number,
    tokenAddr: string, // Hex String
    tokenId: string, // Hex String
    tokenType: Token,
    txnHash: string, // Hex String
};

const TransactionCard: React.FC<CardProps> = ({ ...props }) => {
    const { direction, netAmount, timestamp, tokenAddr, tokenId, tokenType, txnHash } = props;
    let netAmt = "1";
    if (tokenType === "ERC20") {
        const weiAmt = parseFloat(parseInt(netAmount, 16).toString());
        netAmt = (weiAmt/Math.pow(10, decimals[tokenAddr])).toFixed(Math.min(4, decimals[tokenAddr]));
    }

    if (direction === "IN") {
        netAmt = "+ " + netAmt;
    } else {
        netAmt = "- " + netAmt;
    }

    const directionDefaultClasses = "px-1 col-span-1 rounded-lg font-medium w-1/2 justify-self-center text-center"
    const directionClasses = direction === "IN" ? directionDefaultClasses + " text-green-500 bg-green-200" : directionDefaultClasses + " text-red-500 bg-red-200"

    return (
        <div className="grid grid-cols-12 rounded-lg py-5 drop-shadow-lg hover:drop-shadow-2xl bg-white w-5/6 text-lg items-center">
            <a target="_blank" rel="noreferrer" href={"https://explorer.harmony.one/tx/" + txnHash} className="px-5 col-span-1 font-bold hover:text-blue-500 transition duration-200 ease-in-out">{txnHash.substr(0, 8)}</a>
            <span className="px-5 col-span-2">{new Date(timestamp * 1000).toUTCString()}</span>
            <div className={directionClasses}>
                {direction}
            </div>
            <div className="px-5 col-span-1">
                <img className="w-14 transition duration-150" alt={addrs_to_token[tokenAddr]} data-bs-toggle="tooltip" data-bs-placement="top" title={addrs_to_token[tokenAddr]} src={"/" + addrs_to_token[tokenAddr] + ".png"}/>
            </div>
            <span className="px-5 col-span-2">{netAmt}</span>
            <span className="px-5 col-span-2">{tokenId ? tokenId : "N/A"} </span>
            <span className="px-5 col-span-2">Coming Soon</span>
        </div>
    );
};

export default TransactionCard;