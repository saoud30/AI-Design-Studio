import { LogoMaker } from '@/components/logo-maker';
import { SVGMaker } from '@/components/svg-maker';
import { ProductDescriptionGenerator } from '@/components/product-description';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <Tabs defaultValue="logo" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-[600px] mx-auto">
            <TabsTrigger value="logo">AI Logo Maker</TabsTrigger>
            <TabsTrigger value="svg">SVG Maker</TabsTrigger>
            <TabsTrigger value="description">Description Generator</TabsTrigger>
          </TabsList>
          <TabsContent value="logo">
            <LogoMaker />
          </TabsContent>
          <TabsContent value="svg">
            <SVGMaker />
          </TabsContent>
          <TabsContent value="description">
            <ProductDescriptionGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}