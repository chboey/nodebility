'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, ArrowRight, Globe, Wallet } from 'lucide-react';
import Image from 'next/image';
import clean from '@/images/clean-energy.svg';
import reward from '@/images/coin.svg';
import waste from '@/images/garbage.svg';
import collect from '@/images/garbage.svg';
import money from '@/images/money.svg';
import process from '@/images/conversion.svg';
import nodebility from '@/images/logo.png';

export default function LandingContent({
  openConnectModal,
}: {
  openConnectModal: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#FBFBFBFF]">
      {/* Header */}
      <header className="border-b border-2 bg-[#FBFBFB93] border-[#E5EDCEFF] backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <Image src={nodebility} alt="logo" className="" />
              </div>
              <h1 className="text-2xl font-bold text-[#202519FF]">
                Nodebility
              </h1>
            </div>

            <Button
              variant="ghost"
              onClick={openConnectModal}
              className="flex items-center bg-[#90B9ED] text-black px-3 py-2 rounded-xl transition-all duration-350 hover:shadow-md hover:text-white hover:bg-[#2C2D2A]"
            >
              <Wallet className="w-4 h-4 " />
              <span className="font-mono">Connect Wallet</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-14">
        <div className="text-center max-w-4xl mx-auto ">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-200 to-blue-200 rounded-full flex items-center justify-center shadow-lg">
              <Image src={nodebility} alt="logo" className="" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#202519FF] text-shadow-sm leading-tight">
            Transform Waste Into
            <br />
            Clean Energy
          </h1>
          <p className="text-xl text-slate-700 mb-8 leading-relaxed">
            Join the sustainable revolution with Nodebility&apos;s biogas
            ecosystem. Convert organic waste into renewable energy while earning
            rewards through our decentralized platform powered by Hedera.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#90B9ED] text-black px-8 py-4 text-lg rounded-xl transition-all duration-350 transform hover:scale-105 hover:shadow-xl hover:text-white"
              onClick={openConnectModal}
            >
              <Wallet className="w-5 h-5 mr-2" />
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-[#9AD6A6] hover:bg-green-500 hover:border-green-500 px-8 py-4 text-lg rounded-xl transition-all duration-300 bg-[#9AD6A6] transition-all duration-350 transform hover:scale-105 hover:shadow-xl"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 ">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-[#202519FF] text-shadow-sm">
            Sustainable Energy Ecosystem
          </h2>
          <p className="text-xl text-slate-700 max-w-2xl mx-auto">
            Our innovative platform combines renewable energy production with
            blockchain technology to create a transparent and rewarding
            sustainability ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <Card className="shadow-xl border-0 bg-[#E5EDCE] backdrop-blur-sm hover:shadow-2xl transition-all duration-350 transform hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Image src={waste} alt="waste" className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#202519FF]">
                Waste to Energy
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Convert organic waste materials into clean biogas energy through
                our advanced anaerobic digestion process, reducing landfill
                waste by up to 80%.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-[#E5EDCE] backdrop-blur-sm hover:shadow-2xl transition-all duration-350 transform hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Image src={clean} alt="clean" className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#202519FF]">
                Clean Energy
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Generate renewable electricity and heat from biogas, providing
                sustainable energy solutions that reduce carbon emissions by up
                to 90%.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0  bg-[#E5EDCE] backdrop-blur-sm hover:shadow-2xl transition-all duration-350 transform hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Image src={reward} alt="coin" className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#202519FF]">
                Earn Rewards
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Participate in our tokenized ecosystem and earn $BIOGAS tokens
                for contributing to sustainable energy production and
                governance.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-[#202519FF] text-shadow-sm">
            How It Works
          </h2>
          <p className="text-xl text-slate-700 max-w-2xl mx-auto">
            Our simple 4-step process transforms organic waste into valuable
            energy and rewards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              step: '1',
              title: 'Collect Waste',
              description:
                'Gather organic waste materials from households, farms, and businesses',
              icon: collect,
            },
            {
              step: '2',
              title: 'Process & Convert',
              description:
                'Use anaerobic digestion to break down waste and produce biogas',
              icon: process,
            },
            {
              step: '3',
              title: 'Generate Energy',
              description:
                'Convert biogas into clean electricity and heat for communities',
              icon: clean,
            },
            {
              step: '4',
              title: 'Earn Rewards',
              description:
                'Receive $BIOGAS tokens and participate in ecosystem governance',
              icon: money,
            },
          ].map((item, index) => (
            <Card
              key={index}
              className="shadow-lg border-0 bg-[#E5EDCEFF] backdrop-blur-sm relative overflow-hidden"
            >
              <CardContent className="p-6 text-center">
                <div className="text-8xl font-bold text-slate-800/8 absolute -top-3 right-4 z-0">
                  {item.step}
                </div>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10`}
                >
                  <Image
                    src={item.icon}
                    alt={item.icon}
                    className="w-8 h-8 text-white"
                  />
                </div>
                <h3 className="text-lg font-bold mb-3 text-[#202519FF] relative z-10">
                  {item.title}
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed relative z-10">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12">
        <Card className="shadow-2xl border-0 bg-[url('/discussion.png')] bg-center bg-auto bg-no-repeat text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

          <CardContent className="p-12 text-center relative z-10">
            <Globe className="w-16 h-16 mx-auto mb-6 opacity-80 text-black" />
            <h2 className="text-4xl font-bold mb-4 text-[#202519FF]">
              Ready to Join the Green Revolution?
            </h2>
            <p className="text-xl font-medium mb-8 opacity-90 max-w-2xl mx-auto text-black">
              Connect your wallet and start earning rewards while contributing
              to a sustainable future. Every action counts in building a cleaner
              planet.
            </p>
            <Button
              size="lg"
              className="bg-white text-green-600 hover:text-white px-8 py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl font-semibold"
              onClick={openConnectModal}
            >
              <Wallet className="w-5 h-5 mr-2" />
              Connect Wallet & Start Earning
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-[#FBFBFBFF] backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-center">
            <div className="flex items-center space-x-1 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-green-200 to-blue-200 rounded-lg flex items-center justify-center">
                <Image src={nodebility} alt="logo" className="" />
              </div>
              <span className="text-lg font-semibold text-slate-800">
                Nodebility
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
