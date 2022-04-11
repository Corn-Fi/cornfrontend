import React, {useEffect, useState, useReducer} from 'react'
import {Page} from "../../components/Page"
import styled from "styled-components";
import NFTPageHeading from "./components/NFTPageHeading";
import NFTCard from "./components/NFTCard"
import NFTHeaderGrid from "./components/NFTHeaderGrid"
import NFTCardGrid from "./components/NFTCardGrid"
import { useWeb3React } from '@web3-react/core';
import { writeContract, userMint} from "../../utils/nft"
import NFTS from "../../config/nfts"
import TestNFT from "../../config/nftbuild/contracts/TestNFT.json"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NFTABI = TestNFT.abi

const nftReducer = (state, action) => {
    switch (action.type) {
        case "loading": {
            return {
                ...state,
                loading: action.payload
            }
        }
        case "nftContracts": {
            return {
                ...state,
                nftContracts: action.payload
            }
        }
        case "nftData": {
            return {
                ...state,
                nftData: action.payload
            }
        }
    }
} 

const initialState = {
    loading: true,
    nftContracts: {},
    nftData: {}
}

const NFTs = () => {
    const [state, dispatch] = useReducer(nftReducer, initialState)
    const {active, account, library, connector} = useWeb3React();

    const goodToast = (msg) => {
        const ToastStyle = {
            borderRadius: "50px",
            backdropFilter: "blur(12px) saturate(149%)",
            backgroundColor: "rgba(29, 30, 32, 0.57)",
            border: "2px solid rgba(251, 219, 55, 0.95)",
            padding: "0.42em",
            
        }

        const id = toast(`${msg}`, {
            position: toast.POSITION.BOTTOM_RIGHT,
            style: ToastStyle
        })
        toast.update(id, { render: `${msg}`, hideProgressBar: true, closeOnClick: true, position: "bottom-right", autoClose: 5000, className: 'rotateY animated', draggable: true})
    }

    const handleMint =  async (nftContract) => {
        try {
            goodToast(`Transacting... `)
            const tx = await userMint(nftContract)
            
            const receipt = await tx.wait()
            console.log("RECEIPT DUMMY@")
            console.log(receipt)
            if (receipt.status === 1) {
                goodToast(`Congrats! 🎉 \n https://opensea.io/account 👈`)
            }
            return receipt
        } catch (err) {console.log("error minting NFT")}
    }

    useEffect(() => {
        const data = NFTS
        dispatch({type: "nftData", payload: data})
    }, [])


    useEffect( () => {
        if (active) {
            const nftctr = writeContract(
                active,
                library.getSigner(),
                account,
                NFTS[1].address,
                NFTABI,
            )
            .then( value => {
                dispatch({ type: 'nftContracts', payload: value})
            })
            console.log("This is your fuckin data")
            console.log(state)
        } else {
            console.log("something happened and it wasnt good")
        }
    }, [active, account])


    return (
        <>
        <Page>

            <NFTPageHeading/>

            <NFTHeaderGrid />

            <NFTCardGrid data={state.nftData} contracts={state.nftContracts} mint={handleMint} />



        </Page>
        </>
    )
}

export default NFTs
