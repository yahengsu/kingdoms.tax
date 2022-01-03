import React from 'react';
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
        const weiAmt = parseInt(netAmount, 16).toString();
        const strAmt = weiAmt.substring(0, weiAmt.length - decimals[tokenAddr]) + '.' + weiAmt.substr(weiAmt.length - decimals[tokenAddr]);
        netAmt = parseFloat(strAmt).toFixed(Math.min(4, decimals[tokenAddr]));
    }

    if (direction === "OUT") {
        netAmt = '-' + netAmt;
    }

    const directionDefaultClasses = "px-5 col-span-1"
    const directionClasses = direction === "IN" ? directionDefaultClasses + " text-green-500" : directionDefaultClasses + " text-red-500"

    return (
        <div className="grid grid-cols-12 rounded-md py-5 drop-shadow-lg hover:drop-shadow-2xl bg-white w-5/6 text-lg">
            <a href={"https://explorer.harmony.one/tx/" + txnHash} className="px-5 col-span-1 font-bold">{txnHash.substr(0, 8)}</a>
            <span className="px-5 col-span-2">{new Date(timestamp * 1000).toUTCString()}</span>
            <span className={directionClasses}>{direction}</span>
            <div className="px-5 col-span-2">
                <img className="w-12" src={"/" + addrs_to_token[tokenAddr] + ".png"}/>
                <span>{addrs_to_token[tokenAddr]}</span>
            </div>
            <span className="px-5 col-span-2">{netAmt}</span>
            <span className="px-5 col-span-2">{tokenId ? tokenId : "N/A"} </span>
            <span className="px-5 col-span-2">Coming Soon</span>
        </div>
    );
};

export default TransactionCard;