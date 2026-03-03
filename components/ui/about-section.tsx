import React from "react";
import { Zap, Palette, Puzzle } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-32 bg-background flex flex-col items-center justify-center px-4 md:px-6">
      <h2 className="text-3xl md:text-4xl font-bold max-w-2xl text-foreground text-center">
        Biz Haqimizda
      </h2>
      <p className="text-sm md:text-base text-muted-foreground mt-3 max-w-lg text-center mx-auto">
        18 yildan beri O'zbekiston bozorida yuqori sifatli santexnika va issiqlik tizimlari bilan ishonch qozonib kelmoqdamiz. Yevropa brendlari, professional xizmat va tezkor logistika — bizning asosiy ustunligimiz.
      </p>

      <div className="mt-16 max-w-5xl w-full flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 mx-auto">
        <div className="w-full md:w-1/2">
          <img
            className="w-full rounded-2xl object-cover aspect-square shadow-xl ring-1 ring-border/50"
            src="/showroom.png"
            alt="Stroydom showroom"
          />
        </div>

        <div className="text-left w-full md:w-1/2">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">
            Nega aynan Stroydom?
          </h3>
          

          <div className="flex flex-col gap-8 mt-8">
            <FeatureItem
              icon={Zap}
              title="18 yillik tajriba"
              desc="Bozordagi mustahkam obro' va minglab mamnun mijozlar."
            />
            <FeatureItem
              icon={Palette}
              title="Yevropa sifati"
              desc="Germaniya, Italiya va Avstriya brendlarining sertifikatlangan mahsulotlari."
            />
            <FeatureItem
              icon={Puzzle}
              title="Professional montaj"
              desc="Mutaxassislar tomonidan o'rnatish va texnik qo'llab-quvvatlash."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureItem({
  icon: Icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="size-12 flex-shrink-0 flex items-center justify-center bg-primary/10 border border-primary/20 rounded-xl text-primary">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-base font-semibold text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{desc}</p>
      </div>
    </div>
  );
}
