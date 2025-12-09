import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GraduationCap, ShoppingBag, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

const Home: React.FC = () => {
  const [waveOffset, setWaveOffset] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Pune Table Tennis - Expert Coaching & Premium Equipment in Pune';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Professional table tennis coaching in Pune by Commonwealth certified coach Danish Aga. Premium Butterfly, Stiga, DHS equipment. Book your session today!');
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = e.clientX / window.innerWidth;
    setWaveOffset(x * 20 - 10);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-white"
      onMouseMove={handleMouseMove}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-6"
        >
          <h1 
            className="font-display font-bold text-5xl lg:text-7xl mb-10 text-black relative"
            style={{
              textShadow: `
                0 1px 0 #ccc,
                0 2px 0 #c9c9c9,
                0 3px 0 #bbb,
                0 4px 0 #b9b9b9,
                0 5px 0 #aaa,
                0 6px 1px rgba(0,0,0,.1),
                0 0 5px rgba(0,0,0,.1),
                0 1px 3px rgba(0,0,0,.3),
                0 3px 5px rgba(0,0,0,.2),
                0 5px 10px rgba(0,0,0,.25),
                0 10px 10px rgba(0,0,0,.2),
                0 20px 20px rgba(0,0,0,.15),
                inset 0 -2px 5px rgba(255,255,255,0.3)
              `,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            }}
          >
            Welcome to <span className="text-primary" style={{
              textShadow: `
                0 1px 0 #cc5555,
                0 2px 0 #c95555,
                0 3px 0 #bb4444,
                0 4px 0 #b94444,
                0 5px 0 #aa3333,
                0 6px 1px rgba(0,0,0,.1),
                0 0 5px rgba(239,68,68,.3),
                0 1px 3px rgba(0,0,0,.3),
                0 3px 5px rgba(239,68,68,.2),
                0 5px 10px rgba(0,0,0,.25),
                0 10px 10px rgba(0,0,0,.2),
                0 20px 20px rgba(0,0,0,.15),
                inset 0 -2px 5px rgba(255,255,255,0.4)
              `,
            }}>Pune Table Tennis</span>
          </h1>
          <h2 
            className="text-2xl lg:text-4xl text-gray-700"
            style={{
              textShadow: `
                0 1px 0 #999,
                0 2px 0 #888,
                0 3px 0 #777,
                0 4px 1px rgba(0,0,0,.1),
                0 0 5px rgba(0,0,0,.1),
                0 1px 3px rgba(0,0,0,.3),
                0 3px 5px rgba(0,0,0,.2),
                0 5px 10px rgba(0,0,0,.15),
                inset 0 -1px 3px rgba(255,255,255,0.3)
              `,
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
            }}
          >
            What are you looking for?
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Coaching Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link to="/coaching" className="block group">
              <Card className="h-full hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary overflow-hidden">
                <CardContent className="p-16 flex flex-col items-center text-center space-y-10">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap className="w-16 h-16 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="font-display font-bold text-4xl text-black mb-4">
                      Coaching
                    </h3>
                    <p className="text-gray-700 text-xl">
                      Professional training programs for all skill levels
                    </p>
                  </div>

                  <div className="flex items-center text-primary font-bold text-lg group-hover:translate-x-2 transition-transform duration-300">
                    <span>Explore Programs</span>
                    <ArrowRight className="w-6 h-6 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          {/* Equipment Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Link to="/equipment" className="block group">
              <Card className="h-full hover:shadow-2xl transition-all duration-300 border-2 hover:border-secondary overflow-hidden">
                <CardContent className="p-16 flex flex-col items-center text-center space-y-10">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-secondary to-black flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <ShoppingBag className="w-16 h-16 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="font-display font-bold text-4xl text-black mb-4">
                      Equipment
                    </h3>
                    <p className="text-gray-700 text-xl">
                      Premium table tennis gear and accessories
                    </p>
                  </div>

                  <div className="flex items-center text-secondary font-bold text-lg group-hover:translate-x-2 transition-transform duration-300">
                    <span>Browse Shop</span>
                    <ArrowRight className="w-6 h-6 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
