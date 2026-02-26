import { Composition } from "remotion";
import { SocialClip, socialClipSchema } from "./compositions/SocialClip";
import { Tutorial, tutorialSchema } from "./compositions/Tutorial";
import { DataViz, dataVizSchema } from "./compositions/DataViz";
import { TextAnimation, textAnimationSchema } from "./compositions/TextAnimation";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="social-clip"
        component={SocialClip}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        schema={socialClipSchema}
        defaultProps={{
          title: "Your Title Here",
          subtitle: "Add a subtitle",
          backgroundColor: "#f26a2c",
          textColor: "#ffffff",
        }}
      />
      <Composition
        id="tutorial"
        component={Tutorial}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        schema={tutorialSchema}
        defaultProps={{
          title: "Tutorial Title",
          steps: ["Step 1", "Step 2", "Step 3"],
          backgroundColor: "#013b2d",
          textColor: "#fef2ec",
        }}
      />
      <Composition
        id="data-viz"
        component={DataViz}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        schema={dataVizSchema}
        defaultProps={{
          title: "Data Overview",
          data: [
            { label: "Jan", value: 100 },
            { label: "Feb", value: 150 },
            { label: "Mar", value: 120 },
            { label: "Apr", value: 200 },
          ],
          chartColor: "#f26a2c",
          backgroundColor: "#1a1a2e",
        }}
      />
      <Composition
        id="text-animation"
        component={TextAnimation}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        schema={textAnimationSchema}
        defaultProps={{
          text: "Hello World",
          fontSize: 120,
          fontFamily: "Arial",
          color: "#ffffff",
          backgroundColor: "#000000",
          effect: "fade-in",
        }}
      />
    </>
  );
};
